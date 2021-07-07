/* eslint-disable no-restricted-globals */
import { POINT } from '../consts';

import Observer from '../Observer/Observer';

class Model implements ModelType {
  public observer: ObserverType;

  private config: ConfigType;

  private start: number;

  private end: number;

  public constructor(options: ConfigType) {
    this.config = options;
    this.observer = new Observer();
  }

  public updateDirectly = (data: DataForModel) => {
    this.update(this.processValue, data);
  };

  public updateFromPercent = (data: DataForModel) => {
    this.update(this.processPercent, data);
  };

  public updateFromStride = (data:DataForModel) => {
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

    this.setValues({ start: adaptedStart, end: adaptedEnd });
    this.callTheBroadcast();
  };

  public addValuesUpdateListener(f:(data: DataForView) => void) {
    this.observer.subscribe(f);
  }

  public removeValuesUpdateListener(f:(data: DataForView) => void) {
    this.observer.unsubscribe(f);
  }

  private update = (process: Function, data: DataForModel):void => {
    const currentStart = this.start;
    const currentEnd = this.end;

    const { newStart, newEnd } = process(data);

    switch (process) {
      case this.processValue:
        this.setValues({
          start: newStart,
          end: newEnd,
        });
        this.callTheBroadcast();
        break;
      default:
        if (newStart !== currentStart || newEnd !== currentEnd) {
          this.setValues({
            start: newStart,
            end: newEnd,
          });
          this.callTheBroadcast();
        }
        break;
    }
  };

  private processValue = (data: { startPosition:number, endPosition:number }) => {
    const { rangeStart, type, rangeOffset: range } = this.config.getData();

    const { startPosition, endPosition } = data;

    const currentStart = this.start;
    const currentEnd = this.end;

    let newStart = isNaN(startPosition) ? currentStart : (startPosition - rangeStart);
    let newEnd = isNaN(endPosition) ? currentEnd : (endPosition - rangeStart);

    newEnd = type === POINT
      ? Math.max(0, Math.min(newEnd, range))
      : Math.max(1, Math.min(newEnd, range));
    newStart = type === POINT
      ? 0
      : Math.min(newEnd - 1, Math.max(0, newStart));

    return { newStart, newEnd };
  };

  private processPercent = (data: DataForModel) => {
    const { rangeOffset: range, step } = this.config.getData();

    const { startPosition, endPosition } = data;

    const valueOfStart = this.convertToValue(startPosition);
    const newStart = Math.round(valueOfStart / step) * step;

    const valueOfEnd = this.convertToValue(endPosition);
    const cursorOverFinish = valueOfEnd >= range - (0.5 * (range % step));
    const newEnd = cursorOverFinish
      ? range
      : Math.round(valueOfEnd / step) * step;

    return this.accordinateTheCoordinates([newStart, newEnd]);
  };

  private processStep = (data: DataForModel) => {
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
      if (endPosition < 0) newEnd = Math.ceil(currentEnd / step) * step + step * endPosition;
      if (endPosition > 0) newEnd = Math.floor(currentEnd / step) * step + step * endPosition;
    }

    return this.accordinateTheCoordinates([newStart, newEnd]);
  };

  private accordinateTheCoordinates = (coordinates: Array<number>) => {
    const { type, rangeOffset: range, step } = this.config.getData();

    const [start, end] = coordinates;

    const currentStart = this.start;
    const currentEnd = this.end;

    let normalizedStart:number = isNaN(start) ? currentStart : Math.max(start, 0);
    let normalizedEnd:number = isNaN(end) ? currentEnd : Math.min(end, range);

    const maxStartValue = type === POINT
      ? 0
      : Math.max((Math.ceil(normalizedEnd / step) * step - step), currentStart);

    const minEndValue = type === POINT
      ? 0
      : Math.min((Math.floor(normalizedStart / step) * step + step), currentEnd);

    normalizedStart = Math.min(normalizedStart, maxStartValue);
    normalizedEnd = Math.max(normalizedEnd, minEndValue);

    return {
      newStart: normalizedStart,
      newEnd: normalizedEnd,
    };
  };

  private convertToPercent = (value: number) => value / (this.config.getData().rangeOffset / 100);

  private convertToValue = (percent: number) => percent / (100 / this.config.getData().rangeOffset);

  private setValues = (values: Values) => {
    this.start = values.start;
    this.end = values.end;
  };

  private callTheBroadcast = () => {
    this.observer.broadcast({
      coordinates: {
        start: this.convertToPercent(this.start),
        end: this.convertToPercent(this.end),
      },
      values: this.getValues(),
    });
  };
}

export default Model;
