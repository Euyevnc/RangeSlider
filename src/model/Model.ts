import { POINT } from '../consts';

import Observer from '../observer';

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
    const { rangeStart, rangeOffset, step } = this.config.getData();
    const { start, end } = this;
    const maxDecimalPlace = Math.max(
      (step.toString().split('.')[1]?.length || 0),
      (rangeStart.toString().split('.')[1]?.length || 0),
      (rangeOffset.toString().split('.')[1]?.length || 0),
      (start.toString().split('.')[1]?.length || 0),
      (end.toString().split('.')[1]?.length || 0),
    );

    return {
      start: +(this.start + rangeStart).toFixed(maxDecimalPlace),
      end: +(this.end + rangeStart).toFixed(maxDecimalPlace),
    };
  }

  public adaptValues = () => {
    const { step, rangeOffset: range, type } = this.config.getData();
    let adaptedEnd = this.end === range
      ? range
      : Math.min(range, Math.round(this.end / step) * step);
    let adaptedStart = Math.min(range, Math.round(this.start / step) * step);

    const valuesAreIdentical = adaptedStart === adaptedEnd && type !== POINT;
    if (valuesAreIdentical) {
      const distanceToStart = Math.abs(adaptedStart - this.start);
      const distanceToEnd = Math.abs(adaptedEnd - this.end);
      if (distanceToStart < distanceToEnd) adaptedEnd = Math.min(range, adaptedEnd + step);
      else adaptedStart = Math.ceil(adaptedEnd / step) * step - step;
    }

    this.setValues({
      start: this.matchDecimalPart(adaptedStart),
      end: adaptedEnd === range
        ? adaptedEnd
        : this.matchDecimalPart(adaptedEnd),
    });
  };

  private update = (process: Function, data: RangeSliderModelData): void => {
    const currentStart = this.start;
    const currentEnd = this.end;
    let { start, end } = process(data);

    const valuesIsUpdated = (start !== currentStart || end !== currentEnd);

    if (process === this.processValue) {
      this.setValues({ start, end });
    } else if (valuesIsUpdated) {
      ({ start, end } = this.accordinateTheCoordinates({ start, end }));
      this.setValues({
        start,
        end,
      });
    }
  };

  private processValue = (data: { startPosition: number, endPosition: number }) => {
    const { rangeStart, type, rangeOffset: range } = this.config.getData();
    const { startPosition, endPosition } = data;
    const minDistance = type === POINT ? 0 : 1 / (10 ** this.stepDecimalPlace || 1);
    // const minimalUnit = 1 / (10 ** this.stepDecimalPlace || 1);

    const currentStart = this.start;
    const currentEnd = this.end;

    const actualStart = isNaN(startPosition)
      ? currentStart
      : minDistance && Math.max(0, (startPosition - rangeStart));

    const actualEnd = isNaN(endPosition)
      ? currentEnd
      : Math.min((endPosition - rangeStart), range);

    let normalizedEnd;
    let normalizedStart;
    const startIsPrioritized = !isNaN(startPosition) && !isNaN(endPosition);

    if (startIsPrioritized) {
      normalizedStart = Math.min(actualStart, this.matchDecimalPart(range - minDistance));
      normalizedEnd = Math.max(actualEnd, this.matchDecimalPart(normalizedStart + minDistance));
    } else {
      normalizedStart = actualStart === currentStart
        ? null
        : minDistance && Math.min(actualStart, actualEnd - minDistance);
      normalizedEnd = actualEnd === currentEnd
        ? null
        : Math.max(actualEnd, Math.min(actualStart + minDistance, range));
    }

    return {
      start: normalizedStart,
      end: normalizedEnd,
    };
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
    const { startPosition, endPosition } = data;

    const currentStart = this.start;
    const currentEnd = this.end;

    const stepPerStart = this.matchDecimalPart(currentStart / step);
    const stepPerEnd = this.matchDecimalPart(currentEnd / step);

    const newStart = startPosition < 0
      ? Math.ceil(stepPerStart) * step + step * startPosition
      : Math.floor(stepPerStart) * step + step * startPosition;

    const newEnd = endPosition < 0
      ? Math.ceil(stepPerEnd) * step + step * endPosition
      : Math.floor(stepPerEnd) * step + step * endPosition;

    return { start: newStart, end: newEnd };
  };

  private accordinateTheCoordinates = (coordinates: RangeSliderValues) => {
    const { type, rangeOffset: range, step } = this.config.getData();
    const minDistance = type === POINT ? 0 : step;
    const { start, end } = coordinates;

    const currentStart = this.start;
    const currentEnd = this.end;

    const actualStart = isNaN(start) ? currentStart : minDistance && Math.max(start, 0);
    const actualEnd = isNaN(end) ? currentEnd : Math.min(end, range);

    let normalizedEnd;
    let normalizedStart;
    const startIsPrioritized = !isNaN(start) && !isNaN(end);

    if (startIsPrioritized) {
      normalizedStart = Math.min(actualStart,
        Math.ceil(this.matchDecimalPart(range / step)) * step - minDistance);
      normalizedEnd = Math.max(actualEnd,
        this.matchDecimalPart(normalizedStart / step) * step + minDistance);
    } else {
      const stepPerStart = this.matchDecimalPart(actualStart / step);
      const stepPerEnd = this.matchDecimalPart(actualEnd / step);

      const maxStartValue = minDistance
        && Math.max((Math.ceil(stepPerEnd) * step - minDistance), currentStart);

      const minEndValue = minDistance
        && Math.min((Math.floor(stepPerStart) * step + minDistance), currentEnd);

      normalizedStart = actualStart === currentStart
        ? null
        : this.matchDecimalPart(Math.min(actualStart, maxStartValue));

      normalizedEnd = actualEnd === currentEnd
        ? null
        : (Math.max(actualEnd, minEndValue) === range && range)
          || this.matchDecimalPart(Math.max(actualEnd, minEndValue));
    }
    return {
      start: normalizedStart,
      end: normalizedEnd,
    };
  };

  private setValues = (values: RangeSliderValues) => {
    const { start, end } = values;

    if (start != null) this.start = start;
    if (end != null) this.end = end;

    this.callTheBroadcast();
  };

  private callTheBroadcast = () => {
    const { start, end } = this;

    const coordinates = {
      start: this.convertToPercent(start),
      end: this.convertToPercent(end),
    };

    this.observer.broadcast({
      coordinates,
      values: this.getValues(),
    });
  };

  private get stepDecimalPlace() {
    const { step } = this.config.getData();
    const decimalPart = step.toString().split('.')[1];
    return decimalPart?.length || 0;
  }

  private matchDecimalPart = (number: number) => parseFloat(number.toFixed(this.stepDecimalPlace));

  private convertToPercent = (value: number) => value / (this.config.getData().rangeOffset / 100);

  private convertToValue = (percent: number) => percent / (100 / this.config.getData().rangeOffset);
}

export default Model;
