type SliderObjectType = {
  config: ConfigType;

  model: ModelType;
  view:ViewType;
  presenter:PresenterType;

  init: (startValue?: number, endValue?: number) => void;

  getValue: () => Array<string>;
  setValue: (startValue?: number, endValue?: number) => void;
  adaptValues: () => void;

};
type ConfigType = {
  type: 'range' | 'point';
  orient: 'vertical' | 'horizontal';
  cloud: 'always' | 'click' | 'none' ;

  list: Array<number|string>;
  range: number;
  origin:number;
  step: number;
  scale: boolean;
  scaleInterval: number;
  value: Array<string>;
};

type ModelType = {
  config: ConfigType;
  observer: ObserverType;

  updateDirectively: (data: DataForModel) => void;
  updateFromPercent: (data: DataForModel) => void;
  updateFromStep: (data: DataForModel) => void;

  adaptValues: () => void;
};

type PresenterType = {
  view: ViewType;
  model: ModelType;

  reactToInteraction: CallbackForView;
  reactToUpdate: CallbackForModel;

  connectLayers: () => void;
};

type ViewType = {
  root:HTMLElement;
  element: HTMLElement;
  config: ConfigType;
  observer: ObserverType;

  tumblers: ViewElement;
  line: ViewElement;
  selected: ViewElement;
  scale: ViewElement;
  render: () => void;
  updateView: (data: DataForView) => void;
};

type ViewElement = {
  element: HTMLElement | HTMLElement[];
  config: ConfigType;
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
