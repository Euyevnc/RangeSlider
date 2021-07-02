type SliderObjectType = {
  render: () => void;
  getValue: () => Array<number|string>;
  setValue: (startValue?: number, endValue?: number) => void;
  getConfig: () => any

  changeConfig: (config: UserConfigType) => void

  addValuesUpdateListener: (f: () => void) => void
  removeValuesUpdateListener: (f: () => void) => void

  addConfigChangeListener: (f: () => void) => void
  removeConfigChangeListener: (f: () => void) => void
};

type ConfigType = {
  [index: string]: any;
  type: 'range' | 'point';
  orient: 'vertical' | 'horizontal';
  cloud: 'always' | 'click' | 'none' ;

  list: Array<number|string>;
  rangeOffset: number;
  beginning:number;
  step: number;
  scale: boolean;
  scaleInterval: number;
  value: Array<number | string>;

  start: number;
  end: number
};

type UserConfigType = {
  [index: string]: any;

  type?: 'range' | 'point';
  orient?: 'vertical' | 'horizontal';
  cloud?: 'always' | 'click' | 'none' ;

  list?: Array<number|string>;
  rangeOffset?: number;
  beginning?:number;
  step?: number;
  scale?: boolean;
  scaleInterval?: number;
  value?: Array<number | string>;

  start?: number;
  end?: number
};

type ModelType = {
  config: ConfigType;
  observer: ObserverType;

  updateDirectly : (data: DataForModel) => void;
  updateFromPercent: (data: DataForModel) => void;
  updateFromStep: (data: DataForModel) => void;

  adaptValues: () => void;
};

type PresenterType = {
  addCallback: (f: () => void) => void
  removeCallback: (f: () => void) => void
};

type ViewType = {
  root:HTMLElement;
  element: HTMLElement;
  config: ConfigType;
  observer: ObserverType;

  tumblers: ViewElement;
  line: ViewElement;
  indicator: ViewElement;
  scale: ViewElement;
  render: () => void;
  updateView: (data: DataForView) => void;
};

type ViewElement = {
  config: ConfigType;

  element?: HTMLElement;
  elements?: HTMLElement[];
  callback?: CallbackForView
};

type DataForModel = {
  startPosition?: number;
  endPosition?: number;
};

type DataForView = {
  firstCoordinate:number;
  secondCoordinate: number;
};

type CallbackForView = (method: string, data: DataForModel) => void;

type CallbackForModel = (data: DataForView) => void;

type ObserverType = {
  observers: Array<Function>;
  subscribe: (subscriber: Function) => void;
  unsubscribe: (unsubscriber: Function) => void;
  broadcast: (args?: any) => void;
};

interface JQuery {
  rangeSlider: (config : Object) => SliderObjectType | SliderObjectType[];
}
