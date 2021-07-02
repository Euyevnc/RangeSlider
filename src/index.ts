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
  #config: ConfigType;

  #view: ViewType;

  #presenter: PresenterType;

  #model: ModelType;

  #configChangeObserver = new Observer();

  constructor(root:HTMLElement, options: UserConfigType) {
    this.#config = new Config(options);

    this.#model = new Model(this.#config);
    this.#view = new View(root, this.#config);

    this.#presenter = new Presenter(this.#view, this.#model);

    this.render();
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
      this.#model.updateDirectly({ startPosition: this.#config.origin, endPosition: startValue });
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

  addValuesUpdateListener = (f: () => void) => {
    this.#presenter.addCallback(f);
  };

  removeValuesUpdateListener = (f: () => void) => {
    this.#presenter.removeCallback(f);
  };

  changeConfig = (newConfig: UserConfigType) => {
    const stepBeforeChange = this.#config.step;

    Object.keys(newConfig).forEach((key) => {
      this.#config[key] = newConfig[key];
    });

    this.render();

    if (stepBeforeChange !== this.#config.step) this.#model.adaptValues();
    this.#configChangeObserver.broadcast();
  };

  addConfigChangeListener = (f: () => void) => {
    this.#configChangeObserver.subscribe(f);
  };

  removeConfigChangeListener = (f: () => void) => {
    this.#configChangeObserver.unsubscribe(f);
  };
}

export default sliderInst;
