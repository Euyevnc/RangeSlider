import Observer from '../observer';
import Tumblers from './tumblers';
import Indicator from './indicator';
import Scale from './scale';
import Line from './line';

import './view.scss';

class View implements RangeSliderView {
  public observer: RangeSliderObserver;

  private root: HTMLElement;

  private element: HTMLElement;

  private config: RangeSliderConfig;

  private tumblers: Tumblers;

  private line: Line;

  private indicator: Indicator;

  private scale: Scale;

  public constructor(root: HTMLElement, config: RangeSliderConfig) {
    this.observer = new Observer();

    this.root = root;
    this.config = config;

    this.render();
  }

  public render() {
    const { root, config } = this;
    const { orient } = config.getData();

    const mainElement = document.createElement('div');
    mainElement.className = `range-slider  js-range-slider  range-slider_orient_${orient}`;
    this.element = mainElement;

    this.line = new Line(config, mainElement, this.observer.broadcast);
    this.scale = new Scale(config, mainElement, this.observer.broadcast);

    this.tumblers = new Tumblers(config, this.line.element, this.observer.broadcast);
    this.indicator = new Indicator(config, this.line.element);

    root.innerHTML = '';
    root.append(this.element);
  }

  public updateView = (data: RangeSliderViewData) => {
    const { start: firstCoordinate, end: secondCoordinate } = data.coordinates;
    const { start: startValue, end: endValue } = data.values;

    this.tumblers.update(firstCoordinate, secondCoordinate, startValue, endValue);
    this.indicator.update(firstCoordinate, secondCoordinate);
    this.scale.update(startValue, endValue);
  };
}

export default View;
