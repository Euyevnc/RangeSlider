/* eslint-disable no-restricted-globals */
import { POINT } from '../consts';

import Observer from '../Observer/Observer';

class Model implements ModelI {
  config: ConfigI;

  observer: ObserverI;

  private start: number;

  private end: number;

  constructor(options:ConfigI) {
    this.config = options;
    this.observer = new Observer();
    this.start = 0;
    this.end = this.config.range;
  }

  updateDirectively = (data: DataForModel) => {
    this.#update(this.#valueProcessing, data);
    this.#callTheBroadcast();
  };

  updateFromPercent = (data: DataForModel) => {
    this.#update(this.#percentProcessing, data);
  };

  updateFromStep = (data:DataForModel) => {
    this.#update(this.#stepProseccing, data);
  };

  adaptValues = () => {
    const { step, range, type } = this.config;
    let adaptedStart = Math.round(this.start / step) * step;
    let adaptedEnd = Math.round(this.end / step) * step;

    if (adaptedEnd > range) adaptedEnd = range;
    if (adaptedEnd === 0 && type !== POINT) adaptedEnd = 0 + step;
    if (adaptedEnd <= adaptedStart) adaptedStart = Math.ceil(adaptedEnd / step) * step - step;

    this.#setValue({ start: adaptedStart, end: adaptedEnd });
    this.#callTheBroadcast();
  };

  #update = (processing: Function, data: DataForModel):void => {
    const currentStart = this.start;
    const currentEnd = this.end;

    const { newStart, newEnd } = processing(data);

    if (newStart !== currentStart || newEnd !== currentEnd) {
      this.#setValue({
        start: newStart,
        end: newEnd,
      });
      this.#callTheBroadcast();
    }
  };

  #valueProcessing = (data: { startPosition:number, endPosition:number }) => {
    const { origin, type, range } = this.config;

    const { startPosition, endPosition } = data;

    const currentStart = this.start;
    const currentEnd = this.end;

    let newStart = window.isNaN(startPosition) ? currentStart : (startPosition - origin);
    let newEnd = window.isNaN(endPosition) ? currentEnd : (endPosition - origin);

    newEnd = type === POINT
      ? Math.max(0, Math.min(newEnd, range))
      : Math.max(1, Math.min(newEnd, range));
    newStart = type === POINT
      ? 0
      : Math.min(newEnd - 1, Math.max(0, newStart));

    return { newStart, newEnd };
  };

  #percentProcessing = (data: DataForModel) => {
    const { range, step } = this.config;

    const currentStart = this.start;
    const currentEnd = this.end;

    const { startPosition, endPosition } = data;
    let newStart: number;
    let newEnd: number;

    if (startPosition || startPosition === 0) {
      const valueOfPosition = this.#convertToValue(startPosition);

      const cursorFarEnough = (valueOfPosition - currentStart) >= step * 0.8
        || (currentStart - valueOfPosition) >= step * 0.8;

      const cursorOverMakup = (valueOfPosition % step > step * 0.8
        || valueOfPosition % step < step * 0.2);

      const conditionOfTrigger = cursorFarEnough || cursorOverMakup;

      if (conditionOfTrigger) {
        newStart = Math.round(valueOfPosition / step) * step;
      }
    }

    if (endPosition || endPosition === 0) {
      const valueOfPosition = this.#convertToValue(endPosition);

      const cursorFarEnough = (valueOfPosition - currentEnd >= step * 0.8)
        || (currentEnd - valueOfPosition >= step * 0.8);

      const cursorOverMarkup = (valueOfPosition % step > step * 0.8
        || valueOfPosition % step < step * 0.2);

      const cursorOverFinish = valueOfPosition
        >= range - (0.5 * (range - Math.floor(range / step) * step));

      const conditionOfTrigger = cursorFarEnough || cursorOverMarkup || cursorOverFinish;
      if (conditionOfTrigger) {
        newEnd = cursorOverFinish
          ? range
          : Math.round(valueOfPosition / step) * step;
      }
    }

    return this.#accordinateTheCoordinates([newStart, newEnd]);
  };

  #stepProseccing = (data: DataForModel) => {
    const { step } = this.config;

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

    return this.#accordinateTheCoordinates([newStart, newEnd]);
  };

  #accordinateTheCoordinates = (coordinates: Array<number>) => {
    const { type, range, step } = this.config;

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

  #convertToPercent = (value: number) => value / (this.config.range / 100);

  #convertToValue = (percent: number) => percent / (100 / this.config.range);

  #setValue = (values: { start:number, end : number }) => {
    this.start = values.start;
    this.end = values.end;
    this.config.value = [
      (values.start + this.config.origin).toLocaleString(),
      values.end + this.config.origin.toLocaleString(),
    ];
  };

  #callTheBroadcast = () => {
    this.observer.broadcast({
      firstCoordinate: this.#convertToPercent(this.start),
      secondCoordinate: this.#convertToPercent(this.end),
    });
  };
}

export default Model;
