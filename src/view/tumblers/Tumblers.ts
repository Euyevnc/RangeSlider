import {
  STRIDE, DRAG, POINT, VERTICAL, ALWAYS, CLICK,
} from '../../consts';

import './tumblers.scss';

class Tumblers {
  public elements: HTMLElement[];

  private config: RangeSliderConfig;

  private parent: HTMLElement;

  private clouds: HTMLElement[];

  private callback: RangeSliderViewCallback;

  public constructor(
    option: RangeSliderConfig,
    parent: HTMLElement,
    callback: RangeSliderViewCallback,
  ) {
    this.config = option;
    this.parent = parent;
    this.clouds = [];

    this.callback = callback;

    this.render();
  }

  private render = () => {
    const { orient, type } = this.config.getData();

    const list: Array<HTMLElement> = [];

    for (let i = 0; i < 2; i += 1) {
      const tumblerElement = document.createElement('div');
      tumblerElement.className = `js-range-slider__tumbler range-slider__tumbler  range-slider__tumbler_orient_${orient}`;
      tumblerElement.tabIndex = 0;

      const cloud = this.createCloud();
      this.clouds.push(cloud);
      tumblerElement.append(cloud);
      tumblerElement.addEventListener('touchstart', this.handlerTumblerTouchStart);
      tumblerElement.addEventListener('pointerdown', this.handleTumblerPointerDown);
      tumblerElement.addEventListener('keydown', this.handlerTumblerKeydown);
      tumblerElement.addEventListener('focus', this.handlerTumblerFocus);

      const isInvisible = type === POINT && i === 0;
      if (isInvisible) tumblerElement.style.display = 'none';

      list.push(tumblerElement);
    }

    this.elements = list;
    this.elements.forEach((tumbler) => {
      this.parent.append(tumbler);
    });
  };

  public update(firstCoor: number, secondCoor: number, startValue: number, endValue: number) {
    const { orient } = this.config.getData();

    const [firstTumbler, secondTumbler] = this.elements;

    if (orient === VERTICAL) {
      firstTumbler.style.top = `${100 - firstCoor}%`;
      secondTumbler.style.top = `${100 - secondCoor}%`;
    } else {
      firstTumbler.style.left = `${firstCoor}%`;
      secondTumbler.style.left = `${secondCoor}%`;
    }

    if (secondCoor === 100) {
      firstTumbler.style.zIndex = '2';
    } else {
      firstTumbler.style.zIndex = '1';
    }

    this.updateClouds(startValue, endValue);
  }

  private handlerTumblerTouchStart = (event: TouchEvent) => {
    event.preventDefault();
  };

  private handleTumblerPointerDown = (e: PointerEvent) => {
    const { cloud: displayCloud } = this.config.getData();

    const tumbler = (e.target as HTMLElement).closest('.js-range-slider__tumbler');
    const cloud = tumbler.querySelector('.js-range-slider__cloud ') as HTMLElement;

    const isFirstTumbler = (tumbler === this.elements[0]);
    document.body.style.cursor = 'pointer';
    if (displayCloud === CLICK) cloud.classList.remove('range-slider__cloud_invisible');

    const handlerDocumentMove = (event: PointerEvent) => {
      this.handlerDocumentMove(event, isFirstTumbler);
    };

    const handlerDocumentPointerUp = () => {
      if (displayCloud === CLICK) cloud.classList.add('range-slider__cloud_invisible');
      document.body.style.cursor = 'auto';
      document.removeEventListener('pointermove', handlerDocumentMove);
    };

    document.addEventListener('pointermove', handlerDocumentMove);
    document.addEventListener('pointerup', handlerDocumentPointerUp, { capture: true, once: true });
  };

  private handlerTumblerFocus = (event: FocusEvent) => {
    const { cloud: displayCloud } = this.config.getData();

    const tumbler = (<HTMLElement>event.target);
    const cloud = tumbler.querySelector('.js-range-slider__cloud ') as HTMLElement;
    if (displayCloud === CLICK) cloud.classList.remove('range-slider__cloud_invisible');

    tumbler.onblur = (e) => {
      if (displayCloud === CLICK) cloud.classList.add('range-slider__cloud_invisible');
      (<HTMLElement>e.target).onblur = null;
    };
  };

  private handlerTumblerKeydown = (event: KeyboardEvent) => {
    const { callback } = this;
    const { orient } = this.config.getData();

    const tumbler = (<HTMLElement>event.target);
    const isFirstTumbler = tumbler === this.elements[0];

    const decreaseAmount = (event.key === 'ArrowDown' && orient === VERTICAL) || (event.key === 'ArrowLeft' && orient !== VERTICAL);
    const increaseAmount = (event.key === 'ArrowUp' && orient === VERTICAL) || (event.key === 'ArrowRight' && orient !== VERTICAL);

    if (decreaseAmount) {
      if (isFirstTumbler) callback(STRIDE, { startPosition: -1 });
      else callback(STRIDE, { endPosition: -1 });
      event.preventDefault();
    } else if (increaseAmount) {
      if (isFirstTumbler) callback(STRIDE, { startPosition: 1 });
      else callback(STRIDE, { endPosition: 1 });
      event.preventDefault();
    }
  };

  private handlerDocumentMove = (event: PointerEvent, isFirstTumbler: Boolean) => {
    const { orient } = this.config.getData();
    const sliderZone = this.elements[0].closest('.js-range-slider');

    const verticalOffset = ((sliderZone.getBoundingClientRect().bottom - event.clientY)
      / sliderZone.getBoundingClientRect().height) * 100;
    const horizontalOffset = ((event.clientX - sliderZone.getBoundingClientRect().left)
      / sliderZone.getBoundingClientRect().width) * 100;

    const offsetToTransfer = orient === VERTICAL
      ? verticalOffset
      : horizontalOffset;

    if (isFirstTumbler) {
      this.callback(DRAG, { startPosition: offsetToTransfer });
    } else (this.callback(DRAG, { endPosition: offsetToTransfer }));
  };

  private createCloud = () => {
    const { orient, cloud: displayCloud } = this.config.getData();

    const cloud = document.createElement('div');
    cloud.className = `js-range-slider__cloud range-slider__cloud  range-slider__cloud_orient_${orient}`;
    const elementWithValue = document.createElement('b');
    elementWithValue.className = 'js-range-slider__cloud-value range-slider__cloud-value';
    cloud.append(elementWithValue);
    if (displayCloud !== ALWAYS) cloud.classList.add('range-slider__cloud_invisible');
    return cloud;
  };

  private updateClouds = (startValue: number, endValue: number) => {
    const { elements } = this;
    const { list, orient, type } = this.config.getData();

    let firstValue: string;
    let secondValue: string;

    if (list.length) {
      firstValue = list[startValue].toString();
      secondValue = list[endValue].toString();
    } else {
      firstValue = startValue.toString();
      secondValue = endValue.toString();
    }

    (elements[0].querySelector('.js-range-slider__cloud-value') as HTMLElement).innerText = firstValue;
    (elements[1].querySelector('.js-range-slider__cloud-value') as HTMLElement).innerText = secondValue;

    const [firstTumbler, secondTumbler] = this.elements;

    if (type === POINT) return;

    const tumblerDistance = orient === VERTICAL
      ? Math.abs(firstTumbler.offsetTop - secondTumbler.offsetTop)
      : Math.abs(firstTumbler.offsetLeft - secondTumbler.offsetLeft);

    const firstCloud = this.clouds[0];
    const secondCloud = this.clouds[1];
    const firstCloudSize = orient === VERTICAL
      ? firstCloud.offsetHeight
      : firstCloud.offsetWidth;
    const secondCloudSize = orient === VERTICAL
      ? secondCloud.offsetHeight
      : secondCloud.offsetWidth;

    if (tumblerDistance <= firstCloudSize) firstCloud.classList.add('range-slider__cloud_decentralized');
    else firstCloud.classList.remove('range-slider__cloud_decentralized');
    if (tumblerDistance <= secondCloudSize) secondCloud.classList.add('range-slider__cloud_decentralized');
    else secondCloud.classList.remove('range-slider__cloud_decentralized');
  };
}

export default Tumblers;
