class Tumblers {
  elements: HTMLDivElement[];

  root: HTMLElement;

  config: ConfigI;

  constructor(root: HTMLElement, option: ConfigI) {
    this.config = option;
    this.root = root;
  }

  render(callback:Function) {
    const { root, config } = this;
    const list:Array<HTMLDivElement> = [];
    let isFirstTumbler: boolean;

    for (let i = 0; i < 2; i += 1) {
      const tumblerElement = document.createElement('div');
      tumblerElement.className = `js-range-slider__tumbler range-slider__tumbler  range-slider__tumbler_for_${config.orient}`;
      tumblerElement.tabIndex = 0;

      const cloud = createTheCloud();
      tumblerElement.append(cloud);
      tumblerElement.addEventListener('mousedown', handleTumblerMousedown);
      tumblerElement.addEventListener('keydown', handlerTumblerKeydown);
      tumblerElement.addEventListener('focus', handleTumblerFocus);
      if (config.type === 'point' && i === 0) tumblerElement.style.display = 'none';
      list.push(tumblerElement);
    }

    this.elements = list;
    return this.elements;

    function createTheCloud() {
      const cloud = document.createElement('div');
      cloud.className = `js-range-slider__cloud range-slider__cloud  range-slider__cloud_for_${config.orient}`;
      const valueCont = document.createElement('b');
      valueCont.className = 'js-range-slider__cloud-value range-slider__cloud-value';
      cloud.append(valueCont);
      if (config.cloud !== 'always') cloud.style.display = 'none';
      return cloud;
    }
    function handleTumblerMousedown(e:MouseEvent) {
      e.preventDefault();
      const tumbler = (e.target as HTMLElement).closest('.js-range-slider__tumbler');
      isFirstTumbler = (tumbler === list[0]);

      const cloud = tumbler.querySelector('.js-range-slider__cloud ') as HTMLElement;
      if (config.cloud === 'click') cloud.style.display = 'block';

      document.body.style.cursor = 'pointer';
      root.addEventListener('mousemove', handleRootMove);
      document.onmouseup = () => {
        root.removeEventListener('mousemove', handleRootMove);
        if (config.cloud === 'click') cloud.style.display = 'none';
        document.body.style.cursor = 'auto';
        document.onmouseup = null;
      };
    }

    function handleRootMove(event:MouseEvent) {
      const sliderZone = root.querySelector('.js-range-slider');
      const bias = config.orient === 'vertical'
        ? -((event.clientY - sliderZone.getBoundingClientRect().bottom)
        / sliderZone.getBoundingClientRect().height) * 100
        // Минус тут нужен для реверса.так как шкала сверху вниз т.е.противонаправлена оси координат
        : ((event.clientX - sliderZone.getBoundingClientRect().x)
        / sliderZone.getBoundingClientRect().width) * 100;
      if (isFirstTumbler) {
        callback({ startPos: bias, method: 'drag' });
      } else (callback({ endPos: bias, method: 'drag' }));
    }

    function handleTumblerFocus(event:FocusEvent) {
      const tumbler = (<HTMLElement>event.target);
      const cloud = tumbler.querySelector('.js-range-slider__cloud ') as HTMLElement;
      if (config.cloud === 'click') cloud.style.display = 'block';

      tumbler.onblur = (e) => {
        if (config.cloud === 'click') cloud.style.display = 'none';
        (<HTMLElement>e.target).onblur = null;
      };
    }

    function handlerTumblerKeydown(event:KeyboardEvent) {
      const tumbler = (<HTMLElement>event.target);
      isFirstTumbler = tumbler === list[0];

      if ((event.key === 'ArrowDown' && config.orient === 'vertical') || (event.key === 'ArrowLeft' && config.orient !== 'vertical')) {
        if (isFirstTumbler) callback({ startPos: -1, method: 'tepping' });
        else callback({ endPos: -1, method: 'tepping' });

        event.preventDefault();
      } else if ((event.key === 'ArrowUp' && config.orient === 'vertical') || (event.key === 'ArrowRight' && config.orient !== 'vertical')) {
        if (isFirstTumbler) callback({ startPos: 1, method: 'tepping' });
        else callback({ endPos: 1, method: 'tepping' });
        event.preventDefault();
      }
    }
  }

  update(firCoor: number, secCoor:number) {
    const { config } = this;
    const firEl = this.elements[0] as HTMLElement;
    const secEl = this.elements[1] as HTMLElement;

    if (config.orient === 'vertical') {
      firEl.style.bottom = `${firCoor}%`;
      secEl.style.bottom = `${secCoor}%`;
    } else {
      firEl.style.left = `${firCoor}%`;
      secEl.style.left = `${secCoor}%`;
    }
    updateClouds(firCoor, secCoor);

    /// ////
    function updateClouds(firPerc:number, secPerc:number) {
      let firValue: string;
      let secValue: string;
      firValue = Math.round((config.range / 100) * firPerc + config.origin).toLocaleString();
      secValue = Math.round((config.range / 100) * secPerc + config.origin).toLocaleString();

      if (config.list.length) {
        firValue = config.list[+firValue].toString();
        secValue = config.list[+secValue].toString();
      }

      firEl.querySelector('b').innerText = firValue;
      secEl.querySelector('b').innerText = secValue;
    }
  }
}

export default Tumblers;
