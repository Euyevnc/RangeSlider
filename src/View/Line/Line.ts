import { SCALE_CLICK, VERTICAL, POINT } from '../../consts';

class Line {
  public element: HTMLElement;

  private parent: HTMLElement;

  private config: ConfigType;

  private callback: CallbackForView;

  public constructor(option: ConfigType, parent: HTMLElement, callback: CallbackForView) {
    this.config = option;
    this.parent = parent;
    this.callback = callback;

    this.render();
  }

  private render() {
    const { orient } = this.config.getData();

    const lineElement = document.createElement('div');
    lineElement.className = `range-slider__line  range-slider__line_orient_${orient}`;
    lineElement.addEventListener('click', this.handlerLineClick);
    this.element = lineElement;
    this.parent.append(this.element);
  }

  private handlerLineClick = (event: MouseEvent) => {
    const { orient, type } = this.config.getData();

    const clickPosition = orient === VERTICAL
      ? event.clientY
      : event.clientX;
    const sliderZone = this.element.closest('.js-range-slider');

    const verticalOffset = ((sliderZone.getBoundingClientRect().bottom - clickPosition)
      / sliderZone.getBoundingClientRect().height) * 100;
    const horizontalOffset = ((clickPosition - sliderZone.getBoundingClientRect().left)
      / sliderZone.getBoundingClientRect().width) * 100;

    const offsetToTransfer = orient === VERTICAL
      ? verticalOffset
      : horizontalOffset;

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
      this.callback(SCALE_CLICK, { endPosition: offsetToTransfer });
    } else this.callback(SCALE_CLICK, { startPosition: offsetToTransfer });
  };
}

export default Line;
