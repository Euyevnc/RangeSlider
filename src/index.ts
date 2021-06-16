import { POINT } from './consts';
import View from './View/View';
import Model from './Model/Model';
import Presenter from './Presenter/Presenter';

import Config from './Config/Config';

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
  config: ConfigType;

  view: ViewType;

  presenter: PresenterType;

  model: ModelType;

  constructor(root:HTMLElement, options: ConfigType) {
    this.config = new Config(options);

    this.view = new View(root, this.config);
    this.model = new Model(this.config);

    this.presenter = new Presenter(this.view, this.model);
  }

  init(startValue:number, endValue:number) {
    this.view.render();
    this.setValue(startValue, endValue);
  }

  adaptValues() {
    this.model.adaptValues();
  }

  getValue() {
    return this.config.value;
  }

  setValue(startValue:number, endValue:number) {
    if (this.config.type === POINT) {
      this.model.updateDirectly({ startPosition: this.config.origin, endPosition: startValue });
    } else this.model.updateDirectly({ startPosition: startValue, endPosition: endValue });
  }
}

export default sliderInst;
