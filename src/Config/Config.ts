/* eslint-disable no-restricted-globals */
import {
  NONE, ALWAYS, CLICK,
  VERTICAL, HORIZONTAL, RANGE, POINT,
} from '../consts';

import INITIALS from './initials';

class Config implements ConfigType {
  private type: typeof RANGE | typeof POINT;

  private orient: typeof HORIZONTAL | typeof VERTICAL;

  private cloud: typeof NONE | typeof ALWAYS | typeof CLICK;

  private rangeOffset: number;

  private rangeStart:number;

  private step: number;

  private scale: boolean;

  private scaleInterval: number;

  private list: Array<number|string>;

  private start: number;

  private end: number;

  public constructor(initialData: UserConfigType) {
    this.setData(initialData);
  }

  public getData() {
    const configClone = {};
    Object.defineProperties(configClone, {
      type: {
        value: this.type,
      },
      orient: {
        value: this.orient,
      },
      list: {
        value: this.list,
      },
      cloud: {
        value: this.cloud,
      },
      scale: {
        value: this.scale,
      },
      rangeStart: {
        value: this.rangeStart,
      },
      scaleInterval: {
        value: this.scaleInterval,
      },
      rangeOffset: {
        value: this.rangeOffset,
      },
      step: {
        value: this.step,
      },
      start: {
        value: this.start,
      },
      end: {
        value: this.end,
      },
    });
    return configClone;
  }

  public setData(config: UserConfigType) {
    const {
      type, list, orient, cloud, scale, rangeStart, scaleInterval, rangeOffset, step, start, end,
    } = config;

    this.type = (type === RANGE || type === POINT)
      ? type
      : (this.type || INITIALS.type);

    this.orient = (orient === VERTICAL || orient === HORIZONTAL)
      ? orient
      : (this.orient || INITIALS.orient);

    this.cloud = (cloud === NONE || cloud === ALWAYS || cloud === CLICK)
      ? cloud
      : (this.cloud || INITIALS.cloud);

    this.scale = scale !== undefined
      ? scale
      : this.scale || INITIALS.scale;

    this.rangeStart = rangeStart !== undefined
      ? Math.round(rangeStart)
      : (this.rangeStart || INITIALS.rangeStart);

    this.rangeOffset = rangeOffset !== undefined
      ? Math.max(1, Math.round(rangeOffset))
      : (this.rangeOffset || INITIALS.rangeOffset);

    this.scaleInterval = scaleInterval !== undefined
      ? Math.min(this.rangeOffset, Math.max(1, Math.round(scaleInterval)))
      : (this.scaleInterval || INITIALS.scaleInterval);

    this.step = step !== undefined
      ? Math.min(this.rangeOffset, Math.max(1, Math.round(step)))
      : (this.step || INITIALS.step);

    if (list && list.length) {
      this.list = list;
      this.rangeOffset = list.length - 1;
      this.rangeStart = 0;
      this.step = 1;
      this.scaleInterval = 1;
    } else {
      this.list = (this.list && this.list.length)
        ? this.list
        : INITIALS.list;
    }

    this.start = start !== undefined
      ? Math.min(this.rangeOffset + this.rangeStart, Math.max(this.rangeStart, Math.round(start)))
      : this.start || INITIALS.start;

    this.end = end !== undefined
      ? Math.min(this.rangeOffset + this.rangeStart, Math.max(this.rangeStart, Math.round(end)))
      : this.end || INITIALS.end;
  }
}

export default Config;
