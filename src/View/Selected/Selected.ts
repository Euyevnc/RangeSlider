import { VERTICAL } from '../../consts';

class Selected {
  element: HTMLElement;

  config: ConfigType;

  constructor(option: ConfigType) {
    this.config = option;
  }

  render() {
    const { config } = this;

    const selectedElement = document.createElement('div');
    selectedElement.className = `range-slider__selected  range-slider__selected_orient_${config.orient}`;

    this.element = selectedElement;
    return this.element;
  }

  update(firstCoor: number, secondCoor: number) {
    const { config } = this;
    const selectedElement = this.element;

    if (config.orient === VERTICAL) {
      selectedElement.style.bottom = `${firstCoor}%`;
      selectedElement.style.top = `${100 - secondCoor}%`;
    } else {
      selectedElement.style.left = `${firstCoor}%`;
      selectedElement.style.right = `${100 - secondCoor}%`;
    }
  }
}

export default Selected;
