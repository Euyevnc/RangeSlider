type RangeSlider = {
  getValues: () => RangeSliderValues;
  setValues: (startValue?: number, endValue?: number) => void;
  getConfig: () => RangeSliderUserConfig

  changeConfig: (config: RangeSliderUserConfig) => void

  addValuesUpdateListener: (f:(data: RangeSliderViewData) => void) => void
  removeValuesUpdateListener: (f:(data: RangeSliderViewData) => void) => void

  addConfigChangeListener: (f:
  (oldConfig: RangeSliderUserConfig, newConfig: RangeSliderUserConfig) => void)
  => void
  removeConfigChangeListener: (f:
  (oldConfig: RangeSliderUserConfig, newConfig: RangeSliderUserConfig) => void)
  => void
};

type RangeSliderConfig = {
  getData: () => RangeSliderUserConfig;
  setData: (config: RangeSliderUserConfig) => void;
};

type RangeSliderUserConfig = {
  type?: 'range' | 'point';
  orient?: 'vertical' | 'horizontal';
  cloud?: 'always' | 'click' | 'none' ;

  list?: Array<number|string>;
  rangeOffset?: number;
  rangeStart?: number;
  step?: number;
  scale?: boolean;
  scaleInterval?: number;

  start?: number;
  end?: number
};

type RangeSliderModel = {
  observer: RangeSliderObserver;
  updateDirectly: (data: RangeSliderModelData) => void;
  updateFromPercent: (data: RangeSliderModelData) => void;
  updateFromStride: (data: RangeSliderModelData) => void;

  adaptValues: () => void;

  getValues: () => RangeSliderValues
};

type RangeSliderView = {
  observer: RangeSliderObserver;

  render: () => void;

  updateView: (data: RangeSliderViewData) => void;
};

type RangeSliderPresenter = {
  addValuesUpdateListener: (f:(data: RangeSliderViewData) => void) => void;
  removeValuesUpdateListener: (f:(data: RangeSliderViewData) => void) => void

};

type RangeSliderObserver = {
  observers: Array<Function>;
  subscribe: (subscriber: Function) => void;
  unsubscribe: (unsubscriber: Function) => void;
  broadcast: (args?: any) => void;
};

type RangeSliderModelData = {
  startPosition?: number;
  endPosition?: number;
};

type RangeSliderViewData = {
  coordinates: RangeSliderValues,
  values: RangeSliderValues;
};

type RangeSliderViewCallback = (method: 'drag' | 'scaleClick' | 'stride', data: RangeSliderModelData) => void;

type RangeSliderModelCallback = (data: RangeSliderViewData) => void;

type RangeSliderValues = {
  start: number;
  end: number;
};

interface JQuery {
  rangeSlider: (config : Object) => RangeSlider;
}
