import Observer from '../Observer/Observer';

class Model implements ModelI {
  config: ConfigI;

  observer: ObserverI;

  private start: number;

  private end: number;

  constructor(options:ConfigI) {
    this.config = options;
    this.observer = new Observer();
  }

  updateConfig(data: { startPos: number, endPos: number, method: string }):void {
    const { config } = this;
    const callback = this.observer.broadcast;
    const {
      type, origin, range, step,
    } = config;
    const { method } = data;

    const currentStart = this.start || 0;
    const currentEnd = !Number.isNaN(this.end) ? this.end : range;
    let newStart: number;
    let newEnd: number;

    if (method === 'direct') changeByDirect(data.startPos - origin, data.endPos - origin);
    else if (method === 'tepping') changeByTepping(data.startPos, data.endPos);
    else if (method === 'drag') changeByDrag(data.startPos, data.endPos);
    else if (method === 'scaleClick') changeByScaleClick(data.startPos - origin);

    if (method !== 'direct') {
      // здесь и далее использую такую конструкцю (!х && х!== 0) т.к.более подходящей короткой
      // проверки на корректность не нашёл.
      if (!newStart && newStart !== 0) newStart = currentStart;
      if (!newEnd && newEnd !== 0) newEnd = currentEnd;

      const maxStartValue = type === 'point'
        ? 0
        : Math.max((Math.ceil(newEnd / step) * step - step), currentStart);

      const minEndValue = type === 'point'
        ? 0
        : Math.min((Math.floor(newStart / step) * step + step), currentEnd);

      newStart = Math.min(Math.max(newStart, 0), Math.max(maxStartValue, 0));
      newEnd = Math.max(Math.min(newEnd, range), Math.min(minEndValue, range));
    }

    if (newStart !== currentStart || newEnd !== currentEnd || method === 'direct') {
      this.start = newStart;
      this.end = newEnd;
      config.value = [newStart + origin, newEnd + origin];
      callback({ firCoor: (100 / range) * newStart, secCoor: (100 / range) * newEnd });
    }

    /// //////////
    function changeByDirect(startPos:number, endPos:number) {
      const maxStartValue = type === 'point' ? 0 : range - 1;
      const minEndValue = type === 'point' ? 0 : 1;

      if (!startPos && startPos !== 0) newStart = currentStart;
      else newStart = startPos;
      if (!endPos && endPos !== 0) newEnd = currentEnd;
      else newEnd = endPos;

      newEnd = Math.min(Math.max(newEnd, minEndValue), range);
      newStart = Math.min(Math.max(newStart, 0), maxStartValue);

      if (newStart >= newEnd && !(newEnd === 0 && type === 'point')) {
        newEnd = currentEnd;
        newStart = currentStart;
      }
    }
    function changeByTepping(startPos:number, endPos:number) {
      if (startPos) {
        if (startPos < 0) newStart = Math.ceil(currentStart / step) * step + step * startPos;
        if (startPos > 0) newStart = Math.floor(currentStart / step) * step + step * startPos;
      }
      if (endPos) {
        if (endPos < 0) newEnd = Math.ceil(currentEnd / step) * step + step * endPos;
        if (endPos > 0) newEnd = Math.floor(currentEnd / step) * step + step * endPos;
      }
    }

    function changeByScaleClick(position:number) {
      if (type === 'point' || Math.abs(position - currentEnd) <= Math.abs(position - currentStart)) {
        newEnd = position;
      } else newStart = position;
    }

    function changeByDrag(startPos:number, endPos:number) {
      if (startPos || startPos === 0) {
        const cursorPosition = (range / 100) * startPos;

        const cursorFarEnough = (cursorPosition - currentStart) >= step * 0.8
          || (currentStart - cursorPosition) >= step * 0.8;

        const cursorOverMakup = (cursorPosition % step > step * 0.8
          || cursorPosition % step < step * 0.2);

        const conditionOfTrigger = cursorFarEnough || cursorOverMakup;

        if (conditionOfTrigger) {
          newStart = Math.round(cursorPosition / step) * step;
        }
      }
      if (endPos || endPos === 0) {
        const cursorPosition = (range / 100) * endPos;

        const cursorFarEnough = (cursorPosition - currentEnd >= step * 0.8)
          || (currentEnd - cursorPosition >= step * 0.8);

        const cursorOverMarkup = (cursorPosition % step > step * 0.8
          || cursorPosition % step < step * 0.2);

        const cursorOverFinish = cursorPosition >= range;

        const conditionOfTrigger = cursorFarEnough || cursorOverMarkup || cursorOverFinish;

        if (conditionOfTrigger) {
          newEnd = Math.round(cursorPosition / step) * step;
        }
      }
    }
  }
}

export default Model;
