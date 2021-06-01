import 'jquery';
import './styles.scss';
import '../src/index';
import '../types/index.d';

initDemo();

function initDemo() {
  document.addEventListener('DOMContentLoaded', () => {
    const block1 = jQuery('.first_wrapper>.panel');
    const slider1 = jQuery('.first_wrapper>div:last-child').rangeSlider({
      type: 'range', step: 1, scale: false, cloud: 'always',
    });
    slider1.init(20, 80);

    connectThePanel(block1, slider1);

    const block2 = jQuery('.second_wrapper>.panel');
    const slider2 = jQuery('.second_wrapper>div:last-child').rangeSlider({
      type: 'point', origin: 10, range: 90, step: 5, scaleInterval: 20, scale: true,
    });
    slider2.init(30);
    connectThePanel(block2, slider2);

    const block3 = jQuery('.third_wrapper>.panel');
    const slider3 = jQuery('.third_wrapper>div:last-child').rangeSlider({
      type: 'point', orient: 'vertical', origin: 0, scaleInterval: 5, range: 10, scale: true,
    });
    slider3.init(5);
    connectThePanel(block3, slider3);

    const block4 = jQuery('.fourt_wrapper>.panel');
    const slider4 = jQuery('.fourt_wrapper>div:last-child').rangeSlider({
      type: 'range', list: ['ἄ', 'β', 'γ', 'λ', 'Ξ', 'ζ', 'π', 'θ', 'ψ'], cloud: 'none', scale: true,
    });
    slider4.init(1, 3);
    connectThePanel(block4, slider4);
  });
}

function connectThePanel(panelNode: JQuery, sliderObject:SliderObjectI) {
  const slider = sliderObject;

  const sync = syncPanel.bind(this, panelNode, sliderObject);
  sync();

  panelNode.find("[name='type']").each((i, e) => {
    e.onchange = () => {
      if (e.getAttribute('value') === 'point') slider.config.type = 'point';
      else slider.config.type = 'range';
      sync();
    };
  });

  panelNode.find("[name='scale']").each((i, e) => {
    e.onchange = () => {
      if (e.getAttribute('value') === 'yes') slider.config.scale = true;
      else slider.config.scale = false;
      sync();
    };
  });
  panelNode.find("[name='cloud']").each((i, e) => {
    e.onchange = () => {
      if (e.getAttribute('value') === 'yes') slider.config.cloud = 'always';
      else if (e.getAttribute('value') === 'click') slider.config.cloud = 'click';
      else slider.config.cloud = 'none';
      sync();
    };
  });
  panelNode.find("[name='orient']").each((i, e) => {
    e.onchange = () => {
      if (e.getAttribute('value') === 'vertical') {
        slider.config.orient = 'vertical';
        panelNode.next().addClass('for_vertical');
      } else {
        slider.config.orient = 'horizontal';
        panelNode.next().removeClass('for_vertical');
      }
      sync();
    };
  });

  panelNode.find("input[name='origin']").on('change', (e) => {
    e.preventDefault();
    const value = Number((e.target as HTMLInputElement).value);
    slider.config.origin = value;
    sync();
  });

  panelNode.find("input[name='range']").on('change', (e) => {
    e.preventDefault();
    const value = Number((e.target as HTMLInputElement).value);
    slider.config.range = value;
    sync();
  });

  panelNode.find("input[name='interval']").on('change', (e) => {
    e.preventDefault();
    const value = Number((e.target as HTMLInputElement).value);
    slider.config.scaleInterval = value;
    sync();
  });

  panelNode.find("input[name='list']").on('change', (e) => {
    e.preventDefault();
    const value = (e.target as HTMLInputElement).value.split(',');
    slider.config.list = value;
    sync();
  });

  panelNode.find("input[name='step']").on('change', (e) => {
    e.preventDefault();
    const value = Number((e.target as HTMLInputElement).value);
    slider.config.step = value;
    sync();
    slider.adaptValues();
  });

  panelNode.find("input[name='first_pos']").on('change', (e) => {
    const value = Number((e.target as HTMLInputElement).value);
    slider.setValue(value);
    sync();
  });

  panelNode.find("input[name='second_pos']").on('change', (e) => {
    const value = Number((e.target as HTMLInputElement).value);
    slider.setValue(undefined, value);
    sync();
  });
  panelNode.find('form').on('submit', (e) => {
    e.preventDefault();
  });

  slider.model.observer.subscribe(() => {
    panelNode.find("input[name='first_pos']").prop('value', slider.getValue()[0]);
    panelNode.find("input[name='second_pos']").prop('value', slider.getValue()[1]);
  });
}

function syncPanel(panelNode: JQuery, slider: SliderObjectI) {
  slider.init();
  if (slider.config.type === 'point') {
    panelNode.find("[name='type'][value='point']").prop('checked', true);
    panelNode.find("[name='first_pos']").prop('disabled', true);
  } else {
    panelNode.find("[name='type'][value='range']").prop('checked', true);
    panelNode.find("[name='first_pos']").prop('disabled', false);
  }

  if (slider.config.cloud === 'always') panelNode.find("[name='cloud'][value='yes']").prop('checked', true);
  else if (slider.config.cloud === 'click') panelNode.find("[name='cloud'][value='click']").prop('checked', true);
  else panelNode.find("[name='cloud'][value='no']").prop('checked', true);

  if (slider.config.orient === 'vertical') panelNode.find("[name='orient'][value='vertical']").prop('checked', true);
  else panelNode.find("[name='orient'][value='horizontal']").prop('checked', true);

  if (!slider.config.scale) {
    panelNode.find("[name='scale'][value='no']").prop('checked', true);
    panelNode.find("[name='interval']").prop('value', '');
    panelNode.find("[name='interval']").prop('disabled', true);
    // panelNode.find("[name='range']").prop('disabled', true);
  } else {
    panelNode.find("[name='scale'][value='yes']").prop('checked', true);
    panelNode.find("[name='interval']").prop('disabled', false);
    panelNode.find("[name='interval']").prop('value', slider.config.scaleInterval);
  }
  if (!slider.config.list.length) {
    panelNode.find("[name='list']").prop('value', '');
    panelNode.find("[name='list']").prop('disabled', true);
    panelNode.find("[name='range']").prop('disabled', false);
    panelNode.find("[name='step']").prop('disabled', false);
    panelNode.find("[name='origin']").prop('disabled', false);
    panelNode.find("[name='interval']").prop('disabled', false);
  } else {
    panelNode.find("[name='list']").prop('disabled', false);
    panelNode.find("[name='range']").prop('disabled', true);
    panelNode.find("[name='step']").prop('disabled', true);
    panelNode.find("[name='origin']").prop('disabled', true);
    panelNode.find("[name='interval']").prop('disabled', true);
    panelNode.find("[name='list']").prop('value', slider.config.list.toString());
  }

  panelNode.find("[name='origin']").prop('value', slider.config.origin);
  panelNode.find("[name='range']").prop('value', slider.config.range);
  panelNode.find("[name='step']").prop('value', slider.config.step);

  panelNode.find("[name='first_pos']").prop('value', slider.getValue()[0]);
  panelNode.find("[name='second_pos']").prop('value', slider.getValue()[1]);
}

export default initDemo;
