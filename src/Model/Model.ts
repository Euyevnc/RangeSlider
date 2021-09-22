import { POINT } from '../consts';

import Observer from '../observer/Observer';

class Model implements RangeSliderModel {
  public observer: RangeSliderObserver;

  private config: RangeSliderConfig;

  private start: number;

  private end: number;

  public constructor(options: RangeSliderConfig) {
    this.config = options;
    this.observer = new Observer();
  }

  public updateDirectly = (data: RangeSliderModelData) => {
    this.update(this.processValue, data);
  };

  public updateFromPercent = (data: RangeSliderModelData) => {
    this.update(this.processPercent, data);
  };

  public updateFromStride = (data: RangeSliderModelData) => {
    this.update(this.processStep, data);
  };

  public getValues() {
    const { rangeStart } = this.config.getData();
    return {
      start: this.start + rangeStart,
      end: this.end + rangeStart,
    };
  }

  public adaptValues = () => {
    const { step, rangeOffset: range, type } = this.config.getData();
    let adaptedEnd = this.end === range
      ? range
      : Math.min(range, Math.round(this.end / step) * step);
    let adaptedStart = Math.min(range, Math.round(this.start / step) * step);

    if (adaptedStart === adaptedEnd && type !== POINT) {
      const distanceToStart = Math.abs(adaptedStart - this.start);
      const distanceToEnd = Math.abs(adaptedEnd - this.end);
      if (distanceToStart < distanceToEnd) adaptedEnd = Math.min(range, adaptedEnd + step);
      else adaptedStart = Math.ceil(adaptedEnd / step) * step - step;
    }

    this.setValues({
      start: adaptedStart,
      end: adaptedEnd,
    });
    this.callTheBroadcast({
      start: this.matchDecimalPart(this.start),
      end: this.matchDecimalPart(this.end),
    });
  };

  private update = (process: Function, data: RangeSliderModelData): void => {
    const currentStart = this.start;
    const currentEnd = this.end;

    let { start, end } = process(data);

    if (process === this.processValue) {
      this.setValues({ start, end });
      this.callTheBroadcast({ start: this.start, end: this.end });
    } else if (start !== currentStart || end !== currentEnd) {
      ({ start, end } = this.accordinateTheCoordinates({ start, end }));

      this.setValues({ start, end });
      this.callTheBroadcast({
        start: this.matchDecimalPart(this.start),
        end: this.matchDecimalPart(this.end),
      });
    }
  };

  private processValue = (data: { startPosition: number, endPosition: number }) => {
    const { rangeStart, type, rangeOffset: range } = this.config.getData();
    const minimalUnit = 1 / (10 ** this.stepDecimalPlace || 1);
    const { startPosition, endPosition } = data;

    const currentStart = this.start;
    const currentEnd = this.end;

    let newStart = isNaN(startPosition) ? currentStart : (startPosition - rangeStart);
    let newEnd = isNaN(endPosition) ? currentEnd : (endPosition - rangeStart);

    newEnd = type === POINT
      ? Math.max(0, Math.min(newEnd, range))
      : Math.max(minimalUnit, Math.min(newEnd, range));
    newStart = type === POINT
      ? 0
      : Math.min(newEnd - minimalUnit, Math.max(0, newStart));

    return { start: newStart, end: newEnd };
  };

  private processPercent = (data: RangeSliderModelData) => {
    const { rangeOffset: range, step } = this.config.getData();

    const { startPosition, endPosition } = data;

    const valueOfStart = this.convertToValue(startPosition);
    const newStart = Math.round(valueOfStart / step) * step;

    const valueOfEnd = this.convertToValue(endPosition);
    const cursorOverFinish = valueOfEnd >= range - (0.5 * (range % step));
    const newEnd = cursorOverFinish
      ? range
      : Math.round(valueOfEnd / step) * step;

    return { start: newStart, end: newEnd };
  };

  private processStep = (data: RangeSliderModelData) => {
    const { step } = this.config.getData();

    const currentStart = this.start;
    const currentEnd = this.end;

    const { startPosition, endPosition } = data;

    let newStart: number;
    let newEnd: number;

    if (startPosition) {
      if (startPosition < 0) {
        newStart = Math.ceil(currentStart / step) * step + step * startPosition;
      } else if (startPosition > 0) {
        newStart = Math.floor(currentStart / step) * step + step * startPosition;
      }
    }

    if (endPosition) {
      if (endPosition < 0) newEnd = Math.ceil(currentEnd / step) * step - step;
      if (endPosition > 0) newEnd = Math.floor(currentEnd / step) * step + step;
    }
    return { start: newStart, end: newEnd };
  };

  private accordinateTheCoordinates = (coordinates: RangeSliderValues) => {
    const { type, rangeOffset: range, step } = this.config.getData();

    const { start, end } = coordinates;

    const currentStart = this.start;
    const currentEnd = this.end;

    let normalizedStart: number = isNaN(start) ? currentStart : Math.max(start, 0);
    let normalizedEnd: number = isNaN(end) ? currentEnd : Math.min(end, range);

    console.log(normalizedEnd, 'normed End');
    const maxStartValue = type === POINT
      ? 0
      : Math.max((Math.ceil(normalizedEnd / step) * step - step), currentStart);

    const minEndValue = type === POINT
      ? 0
      : Math.min(maxStartValue + step, currentEnd);

    console.log(Math.floor(maxStartValue / step) * step, maxStartValue);
    normalizedStart = Math.min(normalizedStart, maxStartValue);
    normalizedEnd = Math.max(normalizedEnd, minEndValue);
    return {
      start: normalizedStart,
      end: normalizedEnd,
    };
  };

  private setValues = (values: RangeSliderValues) => {
    this.start = values.start;
    this.end = values.end;
  };

  private callTheBroadcast = ({ start, end }: RangeSliderValues) => {
    const coordinates = {
      start: this.convertToPercent(start),
      end: this.convertToPercent(end),
    };

    this.observer.broadcast({
      coordinates,
      values: {
        start,
        end,
      },
    });
  };

  private get stepDecimalPlace() {
    const { step } = this.config.getData();
    const decimalPart = step.toString().split('.')[1];
    return decimalPart
      ? decimalPart.length
      : 0;
  }

  private matchDecimalPart = (number: number) => parseFloat(number.toFixed(this.stepDecimalPlace));

  private convertToPercent = (value: number) => value / (this.config.getData().rangeOffset / 100);

  private convertToValue = (percent: number) => percent / (100 / this.config.getData().rangeOffset);
}

export default Model;
