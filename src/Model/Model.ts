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

  updateConfig(data: { startPos: number, endPos: number, method: string }):void {
    const { startPos, endPos, method } = data;

    const currentStart = this.start;
    const currentEnd = this.end;

    const functions = {
      direct: this.#changeByDirect,
      tepping: this.#changeByTepping,
      drag: this.#changeByDrag,
      scaleClick: this.#changeByScaleClick,
    };

    let { newStart, newEnd } = this.#callSuitableMethod({
      functions,
      string: method,
      args: {
        startPosition: startPos,
        endPosition: endPos,
      },
    });

    const alignedValues = this.#normalizeValues({ newStart, newEnd, method });
    newStart = alignedValues.start;
    newEnd = alignedValues.end;

    if (newStart !== currentStart || newEnd !== currentEnd || method === 'direct') {
      this.#setValue({
        start: newStart,
        end: newEnd,
      });
      this.#callTheBroadcast();
    }
  }

  #changeByDrag = (coordinates: { startPosition:number, endPosition:number }) => {
    const { range, step } = this.config;

    const currentStart = this.start;
    const currentEnd = this.end;

    const { startPosition, endPosition } = coordinates;
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

      const cursorOverFinish = valueOfPosition >= range;

      const conditionOfTrigger = cursorFarEnough || cursorOverMarkup || cursorOverFinish;
      if (conditionOfTrigger) {
        newEnd = cursorOverFinish ?
          range 
          : 
          Math.round(valueOfPosition / step) * step;
      }
    }

    return { newStart, newEnd };
  };

  #changeByScaleClick = (coordinates: { startPosition : number }) => {
    const { type, origin } = this.config;

    const currentStart = this.start;
    const currentEnd = this.end;

    const position = coordinates.startPosition - origin;
    let newStart: number;
    let newEnd: number;

    if (type === 'point' || Math.abs(position - currentEnd) <= Math.abs(position - currentStart)) {
      newEnd = position;
    } else newStart = position;

    return { newStart, newEnd };
  };

  #changeByTepping = (coordinates: { startPosition:number, endPosition:number }) => {
    const { step } = this.config;

    const currentStart = this.start;
    const currentEnd = this.end;

    const { startPosition, endPosition } = coordinates;

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

    return { newStart, newEnd };
  };

  #changeByDirect = (coordinates: { startPosition:number, endPosition:number }) => {
    const { origin } = this.config;

    const { startPosition, endPosition } = coordinates;

    const newStart = startPosition - origin;
    const newEnd = endPosition - origin;

    return { newStart, newEnd };
  };

  #normalizeValues = (values: { newStart:number, newEnd:number, method: string }) => {
    const { type, range, step } = this.config;

    const { newStart, newEnd, method } = values;

    const currentStart = this.start;
    const currentEnd = this.end;

    let normalizedStart:number = window.isNaN(newStart) ? currentStart : newStart;
    let normalizedEnd:number = window.isNaN(newEnd) ? currentEnd : newEnd;

    let maxStartValue;
    if (type === 'point') maxStartValue = 0;
    else {
      maxStartValue = method === 'direct'
        ? range - 1
        : Math.max((Math.ceil(normalizedEnd / step) * step - step), currentStart);
    }

    let minEndValue;
    if (type === 'point') minEndValue = 0;
    else {
      minEndValue = method === 'direct'
        ? 1
        : Math.min((Math.floor(normalizedStart / step) * step + step), currentEnd);
    }

    normalizedStart = Math.min(Math.max(normalizedStart, 0), Math.max(maxStartValue, 0));
    normalizedEnd = Math.max(Math.min(normalizedEnd, range), Math.min(minEndValue, range));

    if (normalizedStart >= normalizedEnd && type !== 'point') {
      normalizedStart = currentStart;
      normalizedEnd = currentEnd;
    }

    return {
      start: normalizedStart,
      end: normalizedEnd,
    };
  };

  #convertToPercent = (value: number) => value / (this.config.range / 100);

  #convertToValue = (percent: number) => percent / (100 / this.config.range);

  #setValue = (values: { start:number, end : number }) => {
    this.start = values.start;
    this.end = values.end;
    this.config.value = [
      values.start + this.config.origin,
      values.end + this.config.origin,
    ];
  };

  #callTheBroadcast = () => {
    this.observer.broadcast({
      firCoor: this.#convertToPercent(this.start),
      secCoor: this.#convertToPercent(this.end),
    });
  };

  #callSuitableMethod = (data: { functions: Object, string: string, args: Object }) => {
    const index = Object.keys(data.functions)
      .indexOf(data.string);
    return Object.values(data.functions)[index](data.args);
  };
}

export default Model;
