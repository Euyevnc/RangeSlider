import {
  POINT, VERTICAL, SCALE_CLICK,
} from '../../consts';

class Scale implements ViewElement {
  element: HTMLElement;

  config: ConfigType;

  cells: Array<HTMLElement>;

  callback: CallbackForView;

  constructor(option: ConfigType, callback: CallbackForView) {
    this.config = option;
    this.callback = callback;
    this.cells = [];
  }

  render = () => {
    const { config } = this;
    const numberOfIntervals = Math.ceil(config.range / config.scaleInterval);
    const scaleElement = document.createElement('div');

    scaleElement.className = `range-slider__scale  range-slider__scale_for_${config.orient}`;

    scaleElement.append(this.#createCell(config.origin));
    for (let i = 1; i < numberOfIntervals; i += 1) {
      if (i !== numberOfIntervals - 1 && numberOfIntervals !== 1) {
        scaleElement.append(this.#createCell(i * config.scaleInterval + config.origin));
      } else {
        const shrinkingCell = this.#createCell(i * config.scaleInterval + config.origin);
        shrinkingCell.style.flexShrink = '1';
        scaleElement.append(shrinkingCell);
      }
    }
    const lastCell = this.#createCell(config.range + config.origin);
    if (config.orient === VERTICAL) lastCell.style.height = '0px';
    else lastCell.style.width = '0px';
    scaleElement.append(lastCell);

    if (!config.scale) scaleElement.style.display = 'none';
    this.element = scaleElement;
    return this.element;
  };

  update(firCoor: number, secCoor:number) {
    const { config } = this;
    const scaleElement = this.element;

    const firValue = (config.range / 100) * firCoor + config.origin;
    const secValue = (config.range / 100) * secCoor + config.origin;
    scaleElement.querySelectorAll('.js-range-slider__scale-cell').forEach((el) => {
      const elem = el as HTMLElement;
      const valueInCell = +el.getAttribute('value');
      if (valueInCell >= firValue && valueInCell <= secValue) {
        elem.classList.add('range-slider__scale-cell_status_active');
      } else {
        elem.classList.remove('range-slider__scale-cell_status_active');
      }
    });
  }

  #handlerCellClick = (event:MouseEvent) => {
    const { orient } = this.config;

    const cell = (<HTMLElement>event.target).closest('.js-range-slider__scale-cell') as HTMLElement;
    const value = +cell.getAttribute('value');

    const cellPosition = orient === VERTICAL
      ? cell.offsetTop + cell.offsetHeight
      : cell.offsetLeft;

    const tumblersPositions = orient === VERTICAL
      ? [...cell.closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')]
        .map((tum) => (<HTMLElement>tum).offsetTop)
      : [...cell.closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')].map((tum) => (<HTMLElement>tum).offsetLeft);

    const distanceToFirst = Math.abs(cellPosition - tumblersPositions[0]);
    const distanceToSecond = Math.abs(cellPosition - tumblersPositions[1]);

    if (this.config.type === POINT || distanceToFirst >= distanceToSecond) {
      this.callback(SCALE_CLICK, { endPosition: value });
    } else this.callback(SCALE_CLICK, { startPosition: value });
  };

  #handlerCellKeydown = (event:KeyboardEvent) => {
    if (event.code !== 'Enter') return;

    const { orient } = this.config;

    const cell = (<HTMLElement>event.target).closest('.js-range-slider__scale-cell') as HTMLElement;
    const value = +cell.getAttribute('value');

    const cellPosition = orient === VERTICAL
      ? cell.offsetTop + cell.offsetHeight
      : cell.offsetLeft;

    const tumblersPositions = orient === VERTICAL
      ? [...cell.closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')]
        .map((tum) => (<HTMLElement>tum).offsetTop + (<HTMLElement>tum).offsetHeight)
      : [...cell.closest('.js-range-slider').querySelectorAll('.js-range-slider__tumbler')].map((tum) => (<HTMLElement>tum).offsetLeft + (<HTMLElement>tum).offsetWidth / 2);

    const distanceToFirst = Math.abs(cellPosition - tumblersPositions[0]);
    const distanceToSecond = Math.abs(cellPosition - tumblersPositions[1]);

    if (this.config.type === POINT || distanceToFirst >= distanceToSecond) {
      this.callback(SCALE_CLICK, { endPosition: value });
    } else this.callback(SCALE_CLICK, { startPosition: value });
  };

  #createCell = (int:number) => {
    const { config } = this;
    const isList = Boolean(config.list.length);

    const cell = document.createElement('span');
    cell.className = (`js-range-slider__scale-cell range-slider__scale-cell  range-slider__scale-cell_for_${config.orient}`);

    if (config.orient === VERTICAL) {
      const normalizedHeight = Math.min((config.scaleInterval / config.range) * 100, 100);
      cell.style.height = `${normalizedHeight}%`;
    } else {
      const normalizedWidth = Math.min((config.scaleInterval / config.range) * 100, 100);
      cell.style.width = `${normalizedWidth}%`;
    }

    cell.setAttribute('value', `${int.toLocaleString()}`);

    const amountContainer = document.createElement('span');
    amountContainer.className = 'range-slider__scale-value js-range-slider__scale-value';
    amountContainer.innerHTML = isList
      ? config.list[int].toString()
      : int.toLocaleString();
    amountContainer.tabIndex = 0;
    amountContainer.addEventListener('click', this.#handlerCellClick);
    amountContainer.addEventListener('keydown', this.#handlerCellKeydown);

    cell.append(amountContainer);
    this.cells.push(cell);
    return cell;
  };
}

export default Scale;
