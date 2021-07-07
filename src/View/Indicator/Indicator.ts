import { VERTICAL } from '../../consts';

class Indicator {
  public element: HTMLElement;

  private parent: HTMLElement;

  private config: ConfigType;

  public constructor(option: ConfigType, parent: HTMLElement) {
    this.config = option;
    this.parent = parent;

    this.render();
  }

  private render() {
    const { orient } = this.config.getData();

    const indicatorElement = document.createElement('div');
    indicatorElement.className = `range-slider__indicator  range-slider__indicator_orient_${orient}`;

    this.element = indicatorElement;
    this.parent.append(this.element);
  }

  public update(firstCoor: number, secondCoor: number) {
    const { orient } = this.config.getData();
    const indicatorElement = this.element;

    if (orient === VERTICAL) {
      indicatorElement.style.bottom = `${firstCoor}%`;
      indicatorElement.style.top = `${100 - secondCoor}%`;
    } else {
      indicatorElement.style.left = `${firstCoor}%`;
      indicatorElement.style.right = `${100 - secondCoor}%`;
    }
  }
}

export default Indicator;
