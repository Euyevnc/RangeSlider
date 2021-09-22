import { POINT } from './consts';
import View from './view';
import Model from './model';
import Presenter from './presenter';
import Config from './config';
import Observer from './observer';

const sliderInst = (function ($) {
  // eslint-disable-next-line no-param-reassign
  $.fn.rangeSlider = function (options: RangeSliderUserConfig) {
    const sliderObjects = new SliderObject(this[0], options);

    return sliderObjects;
  };
}(jQuery));

class SliderObject implements RangeSlider {
  private root: HTMLElement;

  private config: RangeSliderConfig;

  private view: RangeSliderView;

  private presenter: RangeSliderPresenter;

  private model: RangeSliderModel;

  private configObserver: Observer;

  public constructor(root: HTMLElement, options: RangeSliderUserConfig) {
    this.root = root;
    this.config = new Config(options);

    this.model = new Model(this.config);
    this.view = new View(this.root, this.config);

    this.presenter = new Presenter(this.view, this.model);
    this.configObserver = new Observer();

    this.addConfigChangeListener(() => {
      this.reRender();
    });

    this.addConfigChangeListener((
      oldConfig: RangeSliderUserConfig,
      newConfig: RangeSliderUserConfig,
    ) => {
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
    const { type } = this.config.getData();
    if (type === POINT) {
      this.model
        .updateDirectly({ endPosition: startValue });
    } else this.model.updateDirectly({ startPosition: startValue, endPosition: endValue });
  }

  public getConfig = () => this.config.getData();

  public changeConfig = (config: RangeSliderUserConfig) => {
    const oldConfig = this.config.getData();
    this.config.setData(config);
    const newConfig = this.config.getData();

    this.configObserver.broadcast(oldConfig, newConfig);
  };

  public addValuesUpdateListener = (f: (data: RangeSliderViewData) => void) => {
    this.presenter.addValuesUpdateListener(f);
  };

  public removeValuesUpdateListener = (f: (data: RangeSliderViewData) => void) => {
    this.presenter.removeValuesUpdateListener(f);
  };

  public addConfigChangeListener = (f: (
    oldConfig: RangeSliderUserConfig,
    newConfig: RangeSliderUserConfig)
  => void) => this.configObserver.subscribe(f);

  public removeConfigChangeListener = (f: (
    oldConfig: RangeSliderUserConfig,
    newConfig: RangeSliderUserConfig)
  => void) => this.configObserver.unsubscribe(f);

  private reRender() {
    this.view.render();
    this.model.updateDirectly({});
  }
}

export default sliderInst;
