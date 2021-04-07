import View from './View/View';
import Model from './Model/Model';
import Presenter from './Presenter/Presenter';

import Config from './Config/Config';

const sliderInst = (function ($) {
  // eslint-disable-next-line no-param-reassign
  $.fn.rangeSlider = function (options:object) {
    const sliderObjects: Array<Object> = [];
    this.each((i:number, elem:HTMLElement) => {
      sliderObjects.push(new SliderObject(elem, options));
    });

    if (sliderObjects.length === 1) return sliderObjects[0];
    return sliderObjects;
  };
}(jQuery));

class SliderObject implements sliderObjectI {
  config: ConfigI;

  view: ViewI;

  presenter: PresenterI;

  model: ModelI;

  constructor(root:HTMLElement, options:Object) {
    this.config = new Config(options);

    this.view = new View(root, this.config);
    this.model = new Model(this.config);

    this.presenter = new Presenter(this.view, this.model);
    this.presenter.connectLayers();
  }

  init(firValue:number, secValue:number) {
    this.view.render();
    this.setValue(firValue, secValue);
  }

  getValue() {
    return this.config.value;
  }

  setValue(start:number, end:number) {
    if (this.config.type === 'point') this.model.updateConfig({ startPos: this.config.origin, endPos: start, method: 'direct' });
    else this.model.updateConfig({ startPos: start, endPos: end, method: 'direct' });
  }
}

export default sliderInst;
