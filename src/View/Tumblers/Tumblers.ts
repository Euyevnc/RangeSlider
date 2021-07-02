import {
  TEPPEING, DRAG, POINT, VERTICAL, ALWAYS, CLICK,
} from '../../consts';

class Tumblers implements ViewElement {
  elements: HTMLElement[];

  config: ConfigType;

  callback: CallbackForView;

  constructor(option: ConfigType, callback: CallbackForView) {
    this.config = option;
    this.callback = callback;
  }

  render = () => {
    const { config } = this;
    const list:Array<HTMLElement> = [];

    for (let i = 0; i < 2; i += 1) {
      const tumblerElement = document.createElement('div');
      tumblerElement.className = `js-range-slider__tumbler range-slider__tumbler  range-slider__tumbler_orient_${config.orient}`;
      tumblerElement.tabIndex = 0;

      const cloud = this.#createTheCloud();
      tumblerElement.append(cloud);
      tumblerElement.addEventListener('mousedown', this.#handleTumblerMousedown);
      tumblerElement.addEventListener('keydown', this.#handlerTumblerKeydown);
      tumblerElement.addEventListener('focus', this.#handleTumblerFocus);
      if (config.type === POINT && i === 0) tumblerElement.style.display = 'none';
      list.push(tumblerElement);
    }

    this.elements = list;
    return this.elements;
  };

  update(firstCoor: number, secondCoor:number) {
    const { config } = this;
    const firstEl = this.elements[0];
    const secondEl = this.elements[1];

    if (config.orient === VERTICAL) {
      firstEl.style.top = `${100 - firstCoor}%`;
      secondEl.style.top = `${100 - secondCoor}%`;
    } else {
      firstEl.style.left = `${firstCoor}%`;
      secondEl.style.left = `${secondCoor}%`;
    }

    if (firstCoor === 100) {
      firstEl.style.zIndex = '11';
      secondEl.style.zIndex = '12';
    } else if (secondCoor === 100) {
      firstEl.style.zIndex = '12';
      secondEl.style.zIndex = '11';
    } else {
      firstEl.style.zIndex = '11';
      secondEl.style.zIndex = '11';
    }
    this.#updateClouds(firstCoor, secondCoor);
  }

  #handleTumblerMousedown = (e:MouseEvent) => {
    e.preventDefault();
    const { config } = this;
    const tumbler = (e.target as HTMLElement).closest('.js-range-slider__tumbler');
    const cloud = tumbler.querySelector('.js-range-slider__cloud ') as HTMLElement;

    const isFirstTumbler = (tumbler === this.elements[0]);

    if (config.cloud === CLICK) cloud.style.display = 'block';
    document.body.style.cursor = 'pointer';

    const handlerDocumentMove = (event: MouseEvent) => {
      this.#handlerDocumentMove(event, isFirstTumbler);
    };

    const handlerDocumentClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (config.cloud === CLICK) cloud.style.display = 'none';
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', handlerDocumentMove);
    };

    document.addEventListener('mousemove', handlerDocumentMove);
    document.addEventListener('click', handlerDocumentClick, { capture: true, once: true });
  };

  #handleTumblerFocus = (event:FocusEvent) => {
    const { config } = this;
    const tumbler = (<HTMLElement>event.target);
    const cloud = tumbler.querySelector('.js-range-slider__cloud ') as HTMLElement;
    if (config.cloud === CLICK) cloud.style.display = 'block';

    tumbler.onblur = (e) => {
      if (config.cloud === CLICK) cloud.style.display = 'none';
      (<HTMLElement>e.target).onblur = null;
    };
  };

  #handlerTumblerKeydown = (event:KeyboardEvent) => {
    const { config, callback } = this;
    const tumbler = (<HTMLElement>event.target);
    const isFirstTumbler = tumbler === this.elements[0];

    if ((event.key === 'ArrowDown' && config.orient === VERTICAL) || (event.key === 'ArrowLeft' && config.orient !== VERTICAL)) {
      const obj = { endPosition: -1 };
      if (isFirstTumbler) callback(TEPPEING, { startPosition: -1 });
      else callback(TEPPEING, obj);

      event.preventDefault();
    } else if ((event.key === 'ArrowUp' && config.orient === VERTICAL) || (event.key === 'ArrowRight' && config.orient !== VERTICAL)) {
      if (isFirstTumbler) callback(TEPPEING, { startPosition: 1 });
      else callback(TEPPEING, { endPosition: 1 });
      event.preventDefault();
    }
  };

  #handlerDocumentMove = (event:MouseEvent, isFirstTumbler: Boolean) => {
    const sliderZone = this.elements[0].closest('.js-range-slider');

    const verticalOffset = ((sliderZone.getBoundingClientRect().bottom - event.clientY)
      / sliderZone.getBoundingClientRect().height) * 100;
    const horizontalOffset = ((event.clientX - sliderZone.getBoundingClientRect().left)
      / sliderZone.getBoundingClientRect().width) * 100;

    const offsetToTransfer = this.config.orient === VERTICAL
      ? verticalOffset
      : horizontalOffset;

    if (isFirstTumbler) {
      this.callback(DRAG, { startPosition: offsetToTransfer });
    } else (this.callback(DRAG, { endPosition: offsetToTransfer }));
  };

  #createTheCloud = () => {
    const cloud = document.createElement('div');
    cloud.className = `js-range-slider__cloud range-slider__cloud  range-slider__cloud_orient_${this.config.orient}`;
    const elementWithValue = document.createElement('b');
    elementWithValue.className = 'js-range-slider__cloud-value range-slider__cloud-value';
    cloud.append(elementWithValue);
    if (this.config.cloud !== ALWAYS) cloud.style.display = 'none';
    return cloud;
  };

  #updateClouds = (firstPerc:number, secondPerc:number) => {
    const { config, elements } = this;
    let firstValue: string;
    let secondValue: string;
    firstValue = ((config.rangeOffset / 100) * firstPerc + config.beginning).toLocaleString();
    secondValue = ((config.rangeOffset / 100) * secondPerc + config.beginning).toLocaleString();

    if (config.list.length) {
      firstValue = config.list[+firstValue].toString();
      secondValue = config.list[+secondValue].toString();
    }

    (elements[0].querySelector('.js-range-slider__cloud-value') as HTMLElement).innerText = firstValue;
    (elements[1].querySelector('.js-range-slider__cloud-value') as HTMLElement).innerText = secondValue;
  };
}

export default Tumblers;
