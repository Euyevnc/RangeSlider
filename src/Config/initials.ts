import { CLICK, HORIZONTAL, RANGE } from '../consts';

const initials: ConfigType = {
  type: RANGE,
  orient: HORIZONTAL,
  cloud: CLICK,

  rangeOffset: 100,
  origin: 0,
  scaleInterval: 10,
  step: 1,
  scale: false,

  list: [] as Array<string>,
  value: [] as Array<string>,

  initialStart: 0,
};

export default initials;
