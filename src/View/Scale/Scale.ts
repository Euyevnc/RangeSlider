import {
  POINT, VERTICAL, SCALE_CLICK,
} from '../../consts';

class Scale {
  public element: HTMLElement;

  private parent: HTMLElement;

  private config: ConfigType;

  private divisions: Array<HTMLElement>;

  private callback: CallbackForView;

  public constructor(option: ConfigType, parent: HTMLElement, callback: CallbackForView) {
    this.config = option;
    this.parent = parent;
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

    scaleElement.append(this.createDivision(rangeStart));
    for (let i = 1; i < numberOfIntervals; i += 1) {
      if (i !== numberOfIntervals - 1 && numberOfIntervals !== 1) {
        scaleElement.append(this.createDivision(i * scaleInterval + rangeStart));
      } else {
        const shrinkingDivision = this.createDivision(i * scaleInterval + rangeStart);
        shrinkingDivision.style.flexShrink = '1';
        scaleElement.append(shrinkingDivision);
      }
    }
    const lastDivision = this.createDivision(rangeOffset + rangeStart);
    if (orient === VERTICAL) lastDivision.style.height = '0px';
    else lastDivision.style.width = '0px';
    scaleElement.append(lastDivision);

    if (!scale) scaleElement.style.display = 'none';
    this.element = scaleElement;
    this.parent.append(this.element);
  };

  public update(startValue: number, endValue: number) {
    const scaleElement = this.element;

    scaleElement.querySelectorAll('.js-range-slider__scale-division').forEach((el) => {
      const elem = el as HTMLElement;
      const valueInDivision = +el.getAttribute('value');
      if (valueInDivision >= startValue && valueInDivision <= endValue) {
        elem.classList.add('range-slider__scale-division_active');
      } else {
        elem.classList.remove('range-slider__scale-division_active');
      }
    });
  }

  private handlerDivisionClick = (event: MouseEvent) => {
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

    if (type === POINT || distanceToFirst >= distanceToSecond) {
      this.callback(SCALE_CLICK, { endPosition: divisionValue });
    } else this.callback(SCALE_CLICK, { startPosition: divisionValue });
  };

  private handlerDivisionKeydown = (event: KeyboardEvent) => {
    if (event.code !== 'Enter') return;

    const { orient, type } = this.config.getData();

    const division = (<HTMLElement>event.target).closest('.js-range-slider__scale-division') as HTMLElement;
    const value = Number(division.getAttribute('value'));

    const divisionPosition = orient === VERTICAL
      ? division.offsetTop + division.offsetHeight
      : division.offsetLeft;

    const tumblersPositions = orient === VERTICAL
      ? [...division.closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')]
        .map((tum) => (<HTMLElement>tum).offsetTop + (<HTMLElement>tum).offsetHeight)
      : [...division.closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')]
        .map((tum) => (<HTMLElement>tum).offsetLeft + (<HTMLElement>tum).offsetWidth / 2);

    const distanceToFirst = Math.abs(divisionPosition - tumblersPositions[0]);
    const distanceToSecond = Math.abs(divisionPosition - tumblersPositions[1]);

    if (type === POINT || distanceToFirst >= distanceToSecond) {
      this.callback(SCALE_CLICK, { endPosition: value });
    } else this.callback(SCALE_CLICK, { startPosition: value });
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

    division.setAttribute('value', `${int.toLocaleString()}`);

    const elementWithValue = document.createElement('span');
    elementWithValue.className = 'range-slider__scale-value js-range-slider__scale-value';
    elementWithValue.innerHTML = isList
      ? list[int].toString()
      : int.toLocaleString();
    elementWithValue.tabIndex = 0;
    elementWithValue.addEventListener('click', this.handlerDivisionClick);
    elementWithValue.addEventListener('keydown', this.handlerDivisionKeydown);

    division.append(elementWithValue);
    this.divisions.push(division);
    return division;
  };
}

export default Scale;
