import {
  NONE, ALWAYS, CLICK,
  VERTICAL, HORIZONTAL, RANGE, POINT,
} from '../consts';

import INITIALS from './initials';

class Config implements RangeSliderConfig {
  private type: typeof RANGE | typeof POINT;

  private orient: typeof HORIZONTAL | typeof VERTICAL;

  private cloud: typeof NONE | typeof ALWAYS | typeof CLICK;

  private rangeOffset: number;

  private rangeStart: number;

  private step: number;

  private scale: boolean;

  private scaleInterval: number;

  private list: Array<number|string>;

  private start: number;

  private end: number;

  public constructor(initialData: RangeSliderUserConfig) {
    this.setData(initialData);
  }

  public getData() {
    const configClone: RangeSliderUserConfig = { ...this, list: [...this.list] };
    return configClone;
  }

  public setData(config: RangeSliderUserConfig) {
    const {
      type, list, orient, cloud, scale, rangeStart, scaleInterval, rangeOffset, step, start, end,
    } = config;

    const isKnownType = (type === RANGE || type === POINT);
    this.type = isKnownType
      ? type
      : (this.type || INITIALS.type);

    const isKnownOrient = (orient === VERTICAL || orient === HORIZONTAL);
    this.orient = isKnownOrient
      ? orient
      : (this.orient || INITIALS.orient);

    const isKnownCloudState = (cloud === NONE || cloud === ALWAYS || cloud === CLICK);
    this.cloud = isKnownCloudState
      ? cloud
      : (this.cloud || INITIALS.cloud);

    this.scale = scale !== undefined
      ? scale
      : this.scale || INITIALS.scale;

    this.rangeStart = rangeStart !== undefined
      ? rangeStart
      : (this.rangeStart || INITIALS.rangeStart);

    this.step = Math.abs(step || this.step || INITIALS.step);

    this.rangeOffset = rangeOffset !== undefined
      ? Math.max(this.step, Math.abs(rangeOffset))
      : (this.rangeOffset || INITIALS.rangeOffset);

    this.scaleInterval = scaleInterval !== undefined
      ? Math.max(this.step, Math.abs(scaleInterval))
      : (this.scaleInterval || INITIALS.scaleInterval);

    const usersList = list && list.length;
    if (usersList) {
      this.list = list;
      this.rangeOffset = list.length - 1;
      this.rangeStart = 0;
      this.step = 1;
      this.scaleInterval = 1;
    } else {
      const configList = this.list && this.list.length;
      this.list = (configList)
        ? this.list
        : INITIALS.list;
    }

    this.end = end !== undefined
      ? end
      : this.end || this.rangeStart + this.rangeOffset;

    this.start = start !== undefined
      ? start
      : this.start || this.rangeStart;
  }
}

export default Config;
