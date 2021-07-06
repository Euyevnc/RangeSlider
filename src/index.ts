import { POINT } from './consts';
import View from './View/View';
import Model from './Model/Model';
import Presenter from './Presenter/Presenter';

import Config from './Config/Config';
import Observer from './Observer/Observer';

const sliderInst = (function ($) {
  // eslint-disable-next-line no-param-reassign
  $.fn.rangeSlider = function (options: ConfigType) {
    const sliderObjects: Array<SliderObjectType> = [];
    this.each((i:number, elem:HTMLElement) => {
      sliderObjects.push(new SliderObject(elem, options));
    });

    if (sliderObjects.length === 1) return sliderObjects[0];
    return sliderObjects;
  };
}(jQuery));

class SliderObject implements SliderObjectType {
  private root: HTMLElement;

  #config: ConfigType;

  #view: ViewType;

  #presenter: PresenterType;

  #model: ModelType;

  #configChangeObserver = new Observer();

  public constructor(root:HTMLElement, options: UserConfigType) {
    this.root = root;
    this.#config = new Config(options);

    this.#model = new Model(this.#config);
    this.#view = new View(this.root, this.#config);

    this.#presenter = new Presenter(this.#view, this.#model);
  }

  render() {
    this.#view.render();
    this.#model.updateDirectly({});
  }

  getValue() {
    return this.#config.value;
  }

  setValue(startValue:number, endValue:number) {
    if (this.#config.type === POINT) {
      this.#model
        .updateDirectly({ startPosition: this.#config.beginning, endPosition: startValue });
    } else this.#model.updateDirectly({ startPosition: startValue, endPosition: endValue });
  }

  getConfig = () => {
    const getters = Object.getOwnPropertyNames(Object.getPrototypeOf(this.#config));
    const configClone = {};
    getters.forEach((prop, index) => {
      if (index !== 0) Object.defineProperty(configClone, prop, { value: this.#config[prop] });
    });

    return configClone;
  };

  addValuesUpdateListener = (f: (data: DataForView) => void) => {
    this.#presenter.addValueUpdateCallback(f);
  };

  removeValuesUpdateListener = (f: (data: DataForView) => void) => {
    this.#presenter.removeValueUpdateCallback(f);
  };

  changeConfig = (newConfig: UserConfigType) => {
    const oldConfig = this.#config.step;

    Object.keys(newConfig).forEach((key) => {
      this.#config[key] = newConfig[key];
    });

    this.render();

    // if (stepBeforeChange !== this.#config.step) this.#model.adaptValues();
    this.#configChangeObserver.broadcast(oldConfig, this.#configChangeObserver);
  };

  addConfigChangeListener = (f: (oldConfig: ConfigType, newConfig: ConfigType) => void) => {
    this.#configChangeObserver.subscribe(f);
  };

  removeConfigChangeListener = (f: (oldConfig: ConfigType, newConfig: ConfigType) => void) => {
    this.#configChangeObserver.unsubscribe(f);
  };
}

export default sliderInst;
