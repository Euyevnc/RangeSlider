import './view.scss';

import Observer from '../Observer/Observer';

import Tumblers from './Tumblers/Tumblers';
import Selected from './Selected/Selected';
import Scale from './Scale/Scale';
import Line from './Line/Line';

class View implements ViewType {
  root:HTMLElement;

  element: HTMLElement;

  config: ConfigType;

  observer: ObserverType;

  tumblers: Tumblers;

  line: Line;

  selected: Selected;

  scale: Scale;

  constructor(root: HTMLElement, option: ConfigType) {
    this.observer = new Observer();

    this.root = root;
    this.config = option;
    this.tumblers = new Tumblers(option, this.observer.broadcast);
    this.scale = new Scale(option, this.observer.broadcast);

    this.line = new Line(option, this.observer.broadcast);
    this.selected = new Selected(option);
  }

  render() {
    const { root, config } = this;

    const mainElement = document.createElement('div');
    mainElement.className = `range-slider  js-range-slider  range-slider_for_${config.orient}`;

    mainElement.append(this.line.render());
    mainElement.append(this.scale.render());

    this.tumblers.render().forEach((el:HTMLElement) => {
      this.line.element.append(el);
    });
    this.line.element.append(this.selected.render());

    this.element = mainElement;
    root.innerHTML = '';
    root.append(this.element);
  }

  updateView(data: DataForView) {
    const { firstCoordinate, secondCoordinate } = data;

    this.tumblers.update(firstCoordinate, secondCoordinate);

    this.selected.update(firstCoordinate, secondCoordinate);

    this.scale.update(firstCoordinate, secondCoordinate);
  }
}

export default View;
