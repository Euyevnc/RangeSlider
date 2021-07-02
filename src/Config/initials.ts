import { CLICK, HORIZONTAL, RANGE } from '../consts';

const initials: ConfigType = {
  type: RANGE,
  orient: HORIZONTAL,
  cloud: CLICK,

  rangeOffset: 100,
  beginning: 0,
  scaleInterval: 10,
  step: 1,
  scale: false,

  list: [] as Array<string>,
  value: [] as Array<string>,

  start: 0,
  end: 0,
};

export default initials;
