import {
  POINT, VERTICAL, SCALE_CLICK,
} from '../../consts';

import './scale.scss';

class Scale {
  public element: HTMLElement;

  private parent: HTMLElement;

  private config: RangeSliderConfig;

  private divisions: Array<HTMLElement>;

  private callback: RangeSliderViewCallback;

  public constructor(
    option: RangeSliderConfig,
    parent: HTMLElement,
    callback: RangeSliderViewCallback,
  ) {
    this.parent = parent;
    this.config = option;
    this.divisions = [];
    this.callback = callback;

    this.render();
  }

  private render = () => {
    const {
      orient, scaleInterval, rangeStart, rangeOffset, scale,
    } = this.config.getData();

    const numberOfIntervals = Math.ceil(rangeOffset / scaleInterval);
    const scaleElement = document.createElement('div');

    scaleElement.className = `js-range-slider__scale range-slider__scale  range-slider__scale_orient_${orient}`;

    for (let i = 0; i <= numberOfIntervals; i += 1) {
      if (i === 0) {
        const firstDivision = this.createDivision(rangeStart);
        if (orient === VERTICAL) firstDivision.style.height = '0px';
        else firstDivision.style.width = '0px';
        scaleElement.append(firstDivision);
      } else if (i === numberOfIntervals) {
        const lastDivision = this.createDivision(rangeOffset + rangeStart);
        lastDivision.style.flexShrink = '1';
        scaleElement.append(lastDivision);
      } else {
        scaleElement.append(this.createDivision(i * scaleInterval + rangeStart));
      }
    }

    if (!scale) scaleElement.style.display = 'none';
    this.element = scaleElement;
    this.parent.append(this.element);
  };

  public update(startValue: number, endValue: number) {
    const scaleElement = this.element;

    scaleElement.querySelectorAll('.js-range-slider__scale-division').forEach((el) => {
      const elem = el as HTMLElement;
      const valueInDivision = +el.getAttribute('value');

      const valueInRange = valueInDivision >= startValue && valueInDivision <= endValue;
      if (valueInRange) {
        elem.classList.add('range-slider__scale-division_active');
      } else {
        elem.classList.remove('range-slider__scale-division_active');
      }
    });
  }

  private handlerDivisionPointerDown = (event: PointerEvent) => {
    const { orient, type } = this.config.getData();

    const division = (<HTMLElement>event.target).closest('.js-range-slider__scale-division') as HTMLElement;

    const divisionPosition = orient === VERTICAL
      ? division.offsetTop
      : division.offsetLeft + division.offsetWidth;

    const tumblersPositions = orient === VERTICAL
      ? [...division.closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')]
        .map((tum) => (<HTMLElement>tum).offsetTop)
      : [...division.closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')]
        .map((tum) => (<HTMLElement>tum).offsetLeft);

    const distanceToFirst = Math.abs(divisionPosition - tumblersPositions[0]);
    const distanceToSecond = Math.abs(divisionPosition - tumblersPositions[1]);

    const divisionValue = orient === VERTICAL
      ? 100 - (100 / (division.closest('.js-range-slider__scale') as HTMLElement).offsetHeight) * divisionPosition
      : (100 / (division.closest('.js-range-slider__scale') as HTMLElement).offsetWidth) * divisionPosition;

    const callForLastTumbler = (type === POINT || distanceToFirst >= distanceToSecond);
    if (callForLastTumbler) {
      this.callback(SCALE_CLICK, { endPosition: divisionValue });
    } else this.callback(SCALE_CLICK, { startPosition: divisionValue });
  };

  private handlerDivisionKeydown = (event: KeyboardEvent) => {
    if (event.code !== 'Enter') return;

    const { orient, type } = this.config.getData();

    const division = (<HTMLElement>event.target).closest('.js-range-slider__scale-division') as HTMLElement;

    const divisionPosition = orient === VERTICAL
      ? division.offsetTop + division.offsetHeight
      : division.offsetLeft;

    const tumblersPositions = orient === VERTICAL
      ? [...division.closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')]
        .map((tum) => (<HTMLElement>tum).offsetTop)
      : [...division.closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')]
        .map((tum) => (<HTMLElement>tum).offsetLeft);

    const distanceToFirst = Math.abs(divisionPosition - tumblersPositions[0]);
    const distanceToSecond = Math.abs(divisionPosition - tumblersPositions[1]);

    const divisionValue = orient === VERTICAL
      ? 100 - (100 / (division.closest('.js-range-slider__scale') as HTMLElement).offsetHeight) * divisionPosition
      : (100 / (division.closest('.js-range-slider__scale') as HTMLElement).offsetWidth) * divisionPosition;

    const callForLastTumbler = (type === POINT || distanceToFirst >= distanceToSecond);
    if (callForLastTumbler) {
      this.callback(SCALE_CLICK, { endPosition: divisionValue });
    } else this.callback(SCALE_CLICK, { startPosition: divisionValue });
  };

  private createDivision = (int: number) => {
    const {
      list, orient, scaleInterval, rangeOffset,
    } = this.config.getData();

    const isList = list.length;

    const division = document.createElement('span');
    division.className = (`js-range-slider__scale-division range-slider__scale-division  range-slider__scale-division_orient_${orient}`);

    if (orient === VERTICAL) {
      const normalizedHeight = Math.min((scaleInterval / rangeOffset) * 100, 100);
      division.style.height = `${normalizedHeight}%`;
    } else {
      const normalizedWidth = Math.min((scaleInterval / rangeOffset) * 100, 100);
      division.style.width = `${normalizedWidth}%`;
    }

    division.setAttribute('value', `${int.toString()}`);

    const elementWithValue = document.createElement('span');
    elementWithValue.className = 'range-slider__scale-value js-range-slider__scale-value';
    elementWithValue.innerHTML = isList
      ? list[int].toString()
      : int.toString();
    elementWithValue.tabIndex = 0;
    elementWithValue.addEventListener('pointerdown', this.handlerDivisionPointerDown);
    elementWithValue.addEventListener('keydown', this.handlerDivisionKeydown);

    division.append(elementWithValue);
    this.divisions.push(division);
    return division;
  };
}

export default Scale;
