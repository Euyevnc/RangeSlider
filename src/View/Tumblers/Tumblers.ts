import {
  TEPPEING, DRAG, POINT, VERTICAL, ALWAYS, CLICK,
} from '../../consts';

class Tumblers {
  elements: HTMLDivElement[];

  root: HTMLElement;

  config: ConfigI;

  callback: Function;

  constructor(option: ConfigI, callback: Function) {
    this.config = option;
    this.callback = callback;
  }

  render = () => {
    const { config } = this;
    const list:Array<HTMLDivElement> = [];

    for (let i = 0; i < 2; i += 1) {
      const tumblerElement = document.createElement('div');
      tumblerElement.className = `js-range-slider__tumbler range-slider__tumbler  range-slider__tumbler_for_${config.orient}`;
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

  update(firCoor: number, secCoor:number) {
    const { config } = this;
    const firEl = this.elements[0] as HTMLElement;
    const secEl = this.elements[1] as HTMLElement;

    if (config.orient === VERTICAL) {
      firEl.style.bottom = `${firCoor}%`;
      secEl.style.bottom = `${secCoor}%`;
    } else {
      firEl.style.left = `${firCoor}%`;
      secEl.style.left = `${secCoor}%`;
    }

    if (firCoor === 100) {
      firEl.style.zIndex = '11';
      secEl.style.zIndex = '12';
    } else if (secCoor === 100) {
      firEl.style.zIndex = '12';
      secEl.style.zIndex = '11';
    } else {
      firEl.style.zIndex = '11';
      secEl.style.zIndex = '11';
    }
    this.#updateClouds(firCoor, secCoor);
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

    document.addEventListener('mousemove', handlerDocumentMove);
    document.onmouseup = () => {
      document.removeEventListener('mousemove', handlerDocumentMove);
      if (config.cloud === CLICK) cloud.style.display = 'none';
      document.body.style.cursor = 'auto';
      document.onmouseup = null;
    };
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
    const bias = this.config.orient === VERTICAL
      ? -((event.clientY - sliderZone.getBoundingClientRect().bottom)
      / sliderZone.getBoundingClientRect().height) * 100
      : ((event.clientX - sliderZone.getBoundingClientRect().x)
      / sliderZone.getBoundingClientRect().width) * 100;
    if (isFirstTumbler) {
      this.callback(DRAG, { startPosition: bias });
    } else (this.callback(DRAG, { endPosition: bias }));
  };

  #createTheCloud = () => {
    const cloud = document.createElement('div');
    cloud.className = `js-range-slider__cloud range-slider__cloud  range-slider__cloud_for_${this.config.orient}`;
    const valueCont = document.createElement('b');
    valueCont.className = 'js-range-slider__cloud-value range-slider__cloud-value';
    cloud.append(valueCont);
    if (this.config.cloud !== ALWAYS) cloud.style.display = 'none';
    return cloud;
  };

  #updateClouds = (firPerc:number, secPerc:number) => {
    const { config, elements } = this;
    let firValue: string;
    let secValue: string;
    firValue = ((config.range / 100) * firPerc + config.origin).toLocaleString();
    secValue = ((config.range / 100) * secPerc + config.origin).toLocaleString();

    if (config.list.length) {
      firValue = config.list[+firValue].toString();
      secValue = config.list[+secValue].toString();
    }

    elements[0].querySelector('b').innerText = firValue;
    elements[1].querySelector('b').innerText = secValue;
  };
}

export default Tumblers;
