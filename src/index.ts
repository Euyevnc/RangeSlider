import { POINT } from './consts';
import View from './View/View';
import Model from './Model/Model';
import Presenter from './Presenter/Presenter';

import Config from './Config/Config';
import Observer from './Observer/Observer';

const sliderInst = (function ($) {
  // eslint-disable-next-line no-param-reassign
  $.fn.rangeSlider = function (options: UserConfigType) {
    const sliderObjects: Array<SliderObjectType> = [];
    this.each((i: number, elem: HTMLElement) => {
      sliderObjects.push(new SliderObject(elem, options));
    });

    if (sliderObjects.length === 1) return sliderObjects[0];
    return sliderObjects;
  };
}(jQuery));

class SliderObject implements SliderObjectType {
  private root: HTMLElement;

  private config: ConfigType;

  private view: ViewType;

  private presenter: Presenter;

  private model: ModelType;

  private configChangeObserver = new Observer();

  public constructor(root: HTMLElement, options: UserConfigType) {
    this.root = root;
    this.config = new Config(options);

    this.model = new Model(this.config);
    this.view = new View(this.root, this.config);

    this.presenter = new Presenter(this.view, this.model);

    this.addConfigChangeListener(() => {
      this.reRender();
    });

    this.addConfigChangeListener((oldConfig: UserConfigType, newConfig: UserConfigType) => {
      if (oldConfig.step !== newConfig.step) this.model.adaptValues();
    });

    const { start, end } = this.config.getData();
    this.model.updateDirectly({
      startPosition: start,
      endPosition: end,
    });
  }

  public getValues() {
    return this.model.getValues();
  }

  public setValues(startValue: number, endValue: number) {
    const { type, rangeStart } = this.config.getData();
    if (type === POINT) {
      this.model
        .updateDirectly({ startPosition: rangeStart, endPosition: startValue });
    } else this.model.updateDirectly({ startPosition: startValue, endPosition: endValue });
  }

  public getConfig = () => this.config.getData();

  public changeConfig = (config: UserConfigType) => {
    const oldConfig = this.config.getData();
    this.config.setData(config);
    const newConfig = this.config.getData();

    this.configChangeObserver.broadcast(oldConfig, newConfig);
  };

  public addValuesUpdateListener = (f: (data: DataForView) => void) => {
    this.model.addValuesUpdateListener(f);
  };

  public removeValuesUpdateListener = (f: (data: DataForView) => void) => {
    this.model.removeValuesUpdateListener(f);
  };

  public addConfigChangeListener = (f: (oldConfig: UserConfigType, newConfig: UserConfigType)
  => void) => this.configChangeObserver.subscribe(f);

  public removeConfigChangeListener = (f: (oldConfig: UserConfigType, newConfig: UserConfigType)
  => void) => this.configChangeObserver.unsubscribe(f);

  private reRender() {
    this.view.render();
    this.model.updateDirectly({});
  }
}

export default sliderInst;
