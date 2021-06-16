import {
  POINT, VERTICAL, SCALE_CLICK,
} from '../../consts';

class Scale implements ViewElement {
  element: HTMLElement;

  config: ConfigType;

  divisions: Array<HTMLElement>;

  callback: CallbackForView;

  constructor(option: ConfigType, callback: CallbackForView) {
    this.config = option;
    this.callback = callback;
    this.divisions = [];
  }

  render = () => {
    const { config } = this;
    const numberOfIntervals = Math.ceil(config.rangeOffset / config.scaleInterval);
    const scaleElement = document.createElement('div');

    scaleElement.className = `range-slider__scale  range-slider__scale_orient_${config.orient}`;

    scaleElement.append(this.#createDivision(config.origin));
    for (let i = 1; i < numberOfIntervals; i += 1) {
      if (i !== numberOfIntervals - 1 && numberOfIntervals !== 1) {
        scaleElement.append(this.#createDivision(i * config.scaleInterval + config.origin));
      } else {
        const shrinkingCell = this.#createDivision(i * config.scaleInterval + config.origin);
        shrinkingCell.style.flexShrink = '1';
        scaleElement.append(shrinkingCell);
      }
    }
    const lastCell = this.#createDivision(config.rangeOffset + config.origin);
    if (config.orient === VERTICAL) lastCell.style.height = '0px';
    else lastCell.style.width = '0px';
    scaleElement.append(lastCell);

    if (!config.scale) scaleElement.style.display = 'none';
    this.element = scaleElement;
    return this.element;
  };

  update(firstCoor: number, secondCoor:number) {
    const { config } = this;
    const scaleElement = this.element;

    const firstValue = (config.rangeOffset / 100) * firstCoor + config.origin;
    const secondValue = (config.rangeOffset / 100) * secondCoor + config.origin;
    scaleElement.querySelectorAll('.js-range-slider__scale-division').forEach((el) => {
      const elem = el as HTMLElement;
      const valueInCell = +el.getAttribute('value');
      if (valueInCell >= firstValue && valueInCell <= secondValue) {
        elem.classList.add('range-slider__scale-division_status_active');
      } else {
        elem.classList.remove('range-slider__scale-division_status_active');
      }
    });
  }

  #handlerCellClick = (event:MouseEvent) => {
    const { orient } = this.config;

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

    if (this.config.type === POINT || distanceToFirst >= distanceToSecond) {
      this.callback(SCALE_CLICK, { endPosition: value });
    } else this.callback(SCALE_CLICK, { startPosition: value });
  };

  #handlerCellKeydown = (event:KeyboardEvent) => {
    if (event.code !== 'Enter') return;

    const { orient } = this.config;

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

    if (this.config.type === POINT || distanceToFirst >= distanceToSecond) {
      this.callback(SCALE_CLICK, { endPosition: value });
    } else this.callback(SCALE_CLICK, { startPosition: value });
  };

  #createDivision = (int:number) => {
    const { config } = this;
    const isList = Boolean(config.list.length);

    const division = document.createElement('span');
    division.className = (`js-range-slider__scale-division range-slider__scale-division  range-slider__scale-division_orient_${config.orient}`);

    if (config.orient === VERTICAL) {
      const normalizedHeight = Math.min((config.scaleInterval / config.rangeOffset) * 100, 100);
      division.style.height = `${normalizedHeight}%`;
    } else {
      const normalizedWidth = Math.min((config.scaleInterval / config.rangeOffset) * 100, 100);
      division.style.width = `${normalizedWidth}%`;
    }

    division.setAttribute('value', `${int.toLocaleString()}`);

    const elementWithValue = document.createElement('span');
    elementWithValue.className = 'range-slider__scale-value js-range-slider__scale-value';
    elementWithValue.innerHTML = isList
      ? config.list[int].toString()
      : int.toLocaleString();
    elementWithValue.tabIndex = 0;
    elementWithValue.addEventListener('click', this.#handlerCellClick);
    elementWithValue.addEventListener('keydown', this.#handlerCellKeydown);

    division.append(elementWithValue);
    this.divisions.push(division);
    return division;
  };
}

export default Scale;
