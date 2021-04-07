class Config implements ConfigI {
  type: string;

  orient: string;

  list: Array<number|string>;

  range: number;

  origin:number;

  step: number;

  scale: boolean;

  scaleInterval: number;

  cloud: string;

  value: Array<number>;

  constructor({
    type = 'range', origin = 0, range = 100, step = 1, list = <Array <number|string>>[], orient = 'horizontal', scale = true, cloud = 'click', scaleInterval = 10,
  }) {
    const verifiedRange = list.length ? list.length - 1 : range;
    const verifiedOrigin = list.length ? 0 : origin;
    const verifiedStep = list.length ? 1 : step;
    const verifiedInterval = list.length ? 1 : scaleInterval;

    this.type = type;
    this.orient = orient;
    this.list = list;
    this.scale = scale;
    this.cloud = cloud;
    this.scaleInterval = verifiedInterval;
    this.range = verifiedRange;
    this.origin = verifiedOrigin;
    this.step = verifiedStep;
  }
}

export default Config;
