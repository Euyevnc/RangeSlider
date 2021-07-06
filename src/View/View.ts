import './view.scss';

import Observer from '../Observer/Observer';

import Tumblers from './Tumblers/Tumblers';
import Indicator from './Indicator/Indicator';
import Scale from './Scale/Scale';
import Line from './Line/Line';

class View implements ViewType {
  public observer: ObserverType;

  private root:HTMLElement;

  private element: HTMLElement;

  private config: ConfigType;

  private tumblers: Tumblers;

  private line: Line;

  private indicator: Indicator;

  private scale: Scale;

  public constructor(root: HTMLElement, config: ConfigType) {
    this.observer = new Observer();

    this.root = root;
    this.config = config;

    this.render();
  }

  public render() {
    const { config, root } = this;

    const mainElement = document.createElement('div');
    mainElement.className = `range-slider  js-range-slider  range-slider_orient_${config.orient}`;
    this.element = mainElement;

    this.scale = new Scale(config, mainElement, this.observer.broadcast);
    this.line = new Line(config, mainElement, this.observer.broadcast);

    this.tumblers = new Tumblers(config, this.line.element, this.observer.broadcast);
    this.indicator = new Indicator(config, this.line.element);

    root.innerHTML = '';
    root.append(this.element);
  }

  public updateView(data: DataForView) {
    const { firstCoordinate, secondCoordinate } = data;

    this.tumblers.update(firstCoordinate, secondCoordinate);

    this.indicator.update(firstCoordinate, secondCoordinate);

    this.scale.update(firstCoordinate, secondCoordinate);
  }
}

export default View;
