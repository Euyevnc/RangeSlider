import { CLICK, HORIZONTAL, RANGE } from '../consts';

const initials: ConfigI = {
  type: RANGE,
  orient: HORIZONTAL,
  cloud: CLICK,

  range: 100,
  origin: 0,
  scaleInterval: 10,
  step: 1,
  scale: false,

  list: [] as Array<string|number>,
  value: [] as Array<number>,
};

export default initials;
