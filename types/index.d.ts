type SliderObjectType = {
  getValues: () => Values;
  setValues: (startValue?: number, endValue?: number) => void;
  getConfig: () => UserConfigType

  changeConfig: (config: UserConfigType) => void

  addValuesUpdateListener: (f:(data: DataForView) => void) => void
  removeValuesUpdateListener: (f:(data: DataForView) => void) => void

  addConfigChangeListener: (f:
  (oldConfig: UserConfigType, newConfig: UserConfigType) => void)
  => void
  removeConfigChangeListener: (f:
  (oldConfig: UserConfigType, newConfig: UserConfigType) => void)
  => void
};

type ConfigType = {
  getData: () => UserConfigType;
  setData: (config: UserConfigType) => void;
};

type UserConfigType = {
  type?: 'range' | 'point';
  orient?: 'vertical' | 'horizontal';
  cloud?: 'always' | 'click' | 'none' ;

  list?: Array<number|string>;
  rangeOffset?: number;
  rangeStart?:number;
  step?: number;
  scale?: boolean;
  scaleInterval?: number;

  start?: number;
  end?: number
};

type ModelType = {
  observer: ObserverType;
  updateDirectly : (data: DataForModel) => void;
  updateFromPercent: (data: DataForModel) => void;
  updateFromStride: (data: DataForModel) => void;

  adaptValues: () => void;

  getValues: () => Values

  addValuesUpdateListener: (f:(data: DataForView) => void) => void
  removeValuesUpdateListener: (f:(data: DataForView) => void) => void

};

type ViewType = {
  observer: ObserverType;

  render: () => void;

  updateView: (data: DataForView) => void;
};

type DataForModel = {
  startPosition?: number;
  endPosition?: number;
};

type DataForView = {
  coordinates: Values,
  values: Values;
};

type CallbackForView = (method: 'drag' | 'scaleClick' | 'stride', data: DataForModel) => void;

type CallbackForModel = (data: DataForView) => void;

type ObserverType = {
  observers: Array<Function>;
  subscribe: (subscriber: Function) => void;
  unsubscribe: (unsubscriber: Function) => void;
  broadcast: (args?: any) => void;
};

type Values = {
  start: number;
  end: number;
};

interface JQuery {
  rangeSlider: (config : Object) => SliderObjectType | SliderObjectType[];
}
