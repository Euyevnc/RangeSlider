import { VERTICAL } from '../../consts';

class Selected {
  element: HTMLElement;

  config: ConfigI;

  constructor(option: ConfigI) {
    this.config = option;
  }

  render() {
    const { config } = this;

    const selectedElement = document.createElement('div');
    selectedElement.className = `range-slider__selected  range-slider__selected_for_${config.orient}`;

    this.element = selectedElement;
    return this.element;
  }

  update(firCoor: number, secCoor: number) {
    const { config } = this;
    const selectedElement = this.element;

    if (config.orient === VERTICAL) {
      selectedElement.style.bottom = `${firCoor}%`;
      selectedElement.style.top = `${100 - secCoor}%`;
    } else {
      selectedElement.style.left = `${firCoor}%`;
      selectedElement.style.right = `${100 - secCoor}%`;
    }
  }
}

export default Selected;
