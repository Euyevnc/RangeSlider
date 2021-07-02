import { VERTICAL } from '../../consts';

class Indicator {
  element: HTMLElement;

  config: ConfigType;

  constructor(option: ConfigType) {
    this.config = option;
  }

  render() {
    const { config } = this;

    const indicatorElement = document.createElement('div');
    indicatorElement.className = `range-slider__indicator  range-slider__indicator_orient_${config.orient}`;

    this.element = indicatorElement;
    return this.element;
  }

  update(firstCoor: number, secondCoor: number) {
    const { config } = this;
    const indicatorElement = this.element;

    if (config.orient === VERTICAL) {
      indicatorElement.style.bottom = `${firstCoor}%`;
      indicatorElement.style.top = `${100 - secondCoor}%`;
    } else {
      indicatorElement.style.left = `${firstCoor}%`;
      indicatorElement.style.right = `${100 - secondCoor}%`;
    }
  }
}

export default Indicator;
