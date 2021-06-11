/* eslint-disable no-restricted-globals */
import {
  NONE, ALWAYS, CLICK,
  VERTICAL, HORIZONTAL, RANGE, POINT,
} from '../consts';

import INITIALS from './initials';

class Config implements ConfigType {
  #type: string;

  #orient: string;

  #list: Array<number|string>;

  #range: number;

  #origin:number;

  #step: number;

  #scale: boolean;

  #scaleInterval: number;

  #cloud: string;

  #value: Array<string>;

  constructor(initialData: {
    type: string,
    orient: string,
    cloud: string,
    origin: number,
    range: number,
    step: number,
    scaleInterval:number
    list: Array<string|number>,
    scale: boolean,
  }) {
    this.list = initialData.list;

    this.range = initialData.range;
    this.step = initialData.step;
    this.origin = initialData.origin;
    this.scaleInterval = initialData.scaleInterval;

    this.type = initialData.type;
    this.orient = initialData.orient;
    this.cloud = initialData.cloud;

    this.scale = initialData.scale;
    this.value = INITIALS.value;
  }

  get type() {
    return this.#type;
  }

  set type(type: string) {
    this.#type = (type === RANGE || type === POINT)
      ? type
      : (this.#type || INITIALS.type);
  }

  get orient() {
    return this.#orient;
  }

  set orient(orient: string) {
    this.#orient = (orient === VERTICAL || orient === HORIZONTAL)
      ? orient
      : (this.#orient || INITIALS.orient);
  }

  get cloud() {
    return this.#cloud;
  }

  set cloud(display: string) {
    this.#cloud = (display === NONE || display === ALWAYS || display === CLICK)
      ? display
      : (this.#cloud || INITIALS.cloud);
  }

  get list() {
    return this.#list;
  }

  set list(list: Array<number|string>) {
    if (list && list.length) {
      this.#list = list;
      this.range = list.length;
      this.origin = 0;
      this.step = 1;
      this.scaleInterval = 1;
    } else {
      this.#list = (this.#list && this.#list.length)
        ? this.#list
        : INITIALS.list;
    }
  }

  get scale() {
    return this.#scale;
  }

  set scale(display: boolean) {
    this.#scale = Boolean(display);
  }

  get origin() {
    return this.#origin;
  }

  set origin(origin: number) {
    if (this.list.length) this.#origin = 0;
    else {
      this.#origin = isNaN(origin)
        ? (this.#origin || INITIALS.origin)
        : Math.round(+origin);
    }
  }

  get scaleInterval() {
    return this.#scaleInterval;
  }

  set scaleInterval(interval: number) {
    if (this.list.length) this.#scaleInterval = 1;
    else {
      this.#scaleInterval = isNaN(interval)
        ? (this.#scaleInterval || INITIALS.scaleInterval)
        : Math.min(this.#range, Math.max(1, Math.round(+interval)));
    }
  }

  get range() {
    return this.#range;
  }

  set range(range: number) {
    if (this.list.length) this.#range = this.list.length - 1;
    else {
      this.#range = isNaN(range)
        ? (this.#range || INITIALS.range)
        : Math.max(1, Math.round(+range));
    }
    this.scaleInterval = this.#scaleInterval;
    this.step = this.#step;
  }

  get step() {
    return this.#step;
  }

  set step(step: number) {
    if (this.list.length) this.#step = 1;
    else {
      this.#step = isNaN(step)
        ? (this.#step || INITIALS.step)
        : Math.min(this.#range, Math.max(1, Math.round(+step)));
    }
  }

  get value() {
    return this.#value;
  }

  set value(value: Array<string>) {
    this.#value = value;
  }
}

export default Config;
