import { DRAG, VERTICAL, POINT } from '../../consts';

class Line implements ViewElement {
  element: HTMLElement;

  config: ConfigType;

  callback: CallbackForView;

  constructor(option: ConfigType, callback: CallbackForView) {
    this.config = option;
    this.callback = callback;
  }

  render() {
    const { config } = this;

    const lineElement = document.createElement('div');
    lineElement.className = `range-slider__line  range-slider__line_orient_${config.orient}`;
    lineElement.addEventListener('click', this.#handlerLineClick);
    this.element = lineElement;
    return this.element;
  }

  #handlerLineClick = (event: MouseEvent) => {
    const { orient, type } = this.config;

    const clickPosition = orient === VERTICAL
      ? event.clientY
      : event.clientX;
    const sliderZone = this.element.closest('.js-range-slider');

    const bias = orient === VERTICAL
      ? -((clickPosition - sliderZone.getBoundingClientRect().bottom)
    / sliderZone.getBoundingClientRect().height) * 100
      : ((clickPosition - sliderZone.getBoundingClientRect().left)
    / sliderZone.getBoundingClientRect().width) * 100;

    const tumblersPositions = orient === VERTICAL
      ? [...(event.target as HTMLElement).closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')]
        .map((tum) => (<HTMLElement>tum)
          .getBoundingClientRect().top + (<HTMLElement>tum).offsetHeight / 2)
      : [...(event.target as HTMLElement).closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')]
        .map((tum) => (<HTMLElement>tum)
          .getBoundingClientRect().left + (<HTMLElement>tum).offsetWidth / 2);
    const distanceToFirst = Math.abs(clickPosition - tumblersPositions[0]);
    const distanceToSecond = Math.abs(clickPosition - tumblersPositions[1]);
    if (type === POINT || distanceToFirst >= distanceToSecond) {
      this.callback(DRAG, { endPosition: bias });
    } else this.callback(DRAG, { startPosition: bias });
  };
}

export default Line;
