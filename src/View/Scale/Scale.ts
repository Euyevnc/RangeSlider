class Scale {
  element: HTMLElement;

  config: ConfigI;

  constructor(option: ConfigI) {
    this.config = option;
  }

  render(callback:Function) {
    const { config } = this;
    const numberOfIntervals = Math.ceil(config.range / config.scaleInterval);
    const isList = Boolean(config.list.length);

    const scaleElement = document.createElement('div');
    scaleElement.className = `range-slider__scale  range-slider__scale_for_${config.orient}`;

    createCell(config.origin);
    for (let i = 1; i < numberOfIntervals; i += 1) {
      if (i !== numberOfIntervals - 1 && i !== 1) {
        createCell(i * config.scaleInterval + config.origin);
      } else createCell(i * config.scaleInterval + config.origin).style.flexShrink = '1';
    }
    config.orient === 'vertical' ? 
      createCell(config.range + config.origin).style.height = '0px'
      :
      createCell(config.range + config.origin).style.width = '0px';

    if (!config.scale) scaleElement.style.display = 'none';
    this.element = scaleElement;
    return this.element;

    function createCell(int:number) {
      const cell = document.createElement('span');
      cell.className = (`js-range-slider__scale-cell range-slider__scale-cell  range-slider__scale-cell_for_${config.orient}`);
      if (config.orient === 'vertical') {
        const normalizedHeight = Math.min( (config.scaleInterval / config.range) * 100, 100)
        cell.style.height = `${normalizedHeight}%`;
      } else {
        const normalizedWidth = Math.min( (config.scaleInterval / config.range) * 100, 100)
        cell.style.width = `${normalizedWidth}%`;
      }
      cell.classList.add(`range-slnider__scale-cell_meaning_${int}`);
      cell.setAttribute('value', `${int}`);

      const amountContainer = document.createElement('span');
      amountContainer.classList.add('range-slider__scale-value');
      amountContainer.innerHTML = isList
        ? config.list[int].toString()
        : int.toLocaleString();

      amountContainer.tabIndex = 0;
      amountContainer.addEventListener('click', handlerCellClick);
      amountContainer.addEventListener('keydown', handlerCellKeydown);
      cell.append(amountContainer);

      scaleElement.append(cell);
      return cell;
    }

    function handlerCellClick(event:MouseEvent) {
      const value = +(<HTMLElement>event.target).closest('.range-slider__scale-cell').getAttribute('value');
      callback({ startPos: value, method: 'scaleClick' });
    }
    function handlerCellKeydown(event:KeyboardEvent) {
      if (event.code !== 'Enter') return;
      const value = +(<HTMLElement>event.target).closest('.range-slider__scale-cell').getAttribute('value');
      callback({ startPos: value, method: 'scaleClick' });
    }
  }

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
}

export default Scale;
