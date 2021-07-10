import 'jquery';
import './styles.scss';
import '../src/index';
import '../types/index.d';

initDemo();

function initDemo() {
  document.addEventListener('DOMContentLoaded', () => {
    const panel1 = jQuery('.demonstration_order_first .demonstration__panel');
    const slider1 = jQuery('.demonstration_order_first .demonstration__container').rangeSlider({
      type: 'range', step: 1, scale: false, cloud: 'always', start: 20, end: 80,
    });

    connectThePanel(panel1, slider1);

    const panel2 = jQuery('.demonstration_order_second .demonstration__panel');
    const slider2 = jQuery('.demonstration_order_second .demonstration__container').rangeSlider({
      type: 'point', beginning: 10, rangeOffset: 90, step: 5, scaleInterval: 20, scale: true, end: 50,
    });
    connectThePanel(panel2, slider2);

    const panel3 = jQuery('.demonstration_order_third .demonstration__panel');
    const slider3 = jQuery('.demonstration_order_third .demonstration__container').rangeSlider({
      type: 'point', orient: 'vertical', beginning: 0, scaleInterval: 5, rangeOffset: 10, scale: true, end: 5,
    });
    connectThePanel(panel3, slider3);

    const panel4 = jQuery('.demonstration_order_fourth .demonstration__panel');
    const slider4 = jQuery('.demonstration_order_fourth .demonstration__container').rangeSlider({
      type: 'range', list: ['ἄ', 'β', 'γ', 'λ', 'Ξ', 'ζ', 'π', 'θ', 'ψ'], cloud: 'none', scale: true, start: 3, end: 6,
    });
    connectThePanel(panel4, slider4);
  });
}

function connectThePanel(panelNode: JQuery, sliderObject: SliderObjectType) {
  const slider = sliderObject;

  const sync = syncPanel.bind(this, panelNode, sliderObject);
  sync();
  slider.addConfigChangeListener(sync);

  panelNode.find("[name='type']").each((i, e) => {
    e.onchange = () => {
      if (e.getAttribute('value') === 'point') slider.changeConfig({ type: 'point' });
      else slider.changeConfig({ type: 'range' });
    };
  });

  panelNode.find("[name='scale']").each((i, e) => {
    e.onchange = () => {
      if (e.getAttribute('value') === 'yes') slider.changeConfig({ scale: true });
      else slider.changeConfig({ scale: false });
    };
  });

  panelNode.find("[name='cloud']").each((i, e) => {
    e.onchange = () => {
      if (e.getAttribute('value') === 'yes') slider.changeConfig({ cloud: 'always' });
      else if (e.getAttribute('value') === 'click') slider.changeConfig({ cloud: 'click' });
      else slider.changeConfig({ cloud: 'none' });
    };
  });

  panelNode.find("[name='orient']").each((i, e) => {
    e.onchange = () => {
      if (e.getAttribute('value') === 'vertical') {
        slider.changeConfig({ orient: 'vertical' });
        panelNode.next().addClass('demonstration__container_vertical');
      } else {
        slider.changeConfig({ orient: 'horizontal' });
        panelNode.next().removeClass('demonstration__container_vertical');
      }
    };
  });

  panelNode.find("input[name='beginning']").on('change', (e) => {
    e.preventDefault();
    const value = Number((e.target as HTMLInputElement).value);
    slider.changeConfig({ rangeStart: value });
  });

  panelNode.find("input[name='range']").on('change', (e) => {
    e.preventDefault();
    const value = Number((e.target as HTMLInputElement).value);
    slider.changeConfig({ rangeOffset: value });
  });

  panelNode.find("input[name='interval']").on('change', (e) => {
    e.preventDefault();
    const value = Number((e.target as HTMLInputElement).value);
    slider.changeConfig({ scaleInterval: value });
  });

  panelNode.find("input[name='list']").on('change', (e) => {
    e.preventDefault();
    const value = (e.target as HTMLInputElement).value.split(',');
    slider.changeConfig({ list: value });
  });

  panelNode.find("input[name='step']").on('change', (e) => {
    e.preventDefault();
    const value = Number((e.target as HTMLInputElement).value);
    slider.changeConfig({ step: value });
  });

  panelNode.find("input[name='first_pos']").on('change', (e) => {
    const value = Number((e.target as HTMLInputElement).value);
    slider.setValues(value);
  });

  panelNode.find("input[name='second_pos']").on('change', (e) => {
    const value = Number((e.target as HTMLInputElement).value);
    slider.setValues(undefined, value);
  });

  panelNode.find('form').on('submit', (e) => {
    e.preventDefault();
  });

  slider.addValuesUpdateListener(() => {
    panelNode.find("input[name='first_pos']").prop('value', slider.getValues().start);
    panelNode.find("input[name='second_pos']").prop('value', slider.getValues().end);
  });
}

function syncPanel(panelNode: JQuery, slider: SliderObjectType) {
  const config = slider.getConfig();

  panelNode.find("[name='first_pos']").prop('value', slider.getValues().start);
  panelNode.find("[name='second_pos']").prop('value', slider.getValues().end);

  if (!config.list.length) {
    panelNode.find("[name='list']").prop('value', '');
    panelNode.find("[name='list']").prop('disabled', true);
    panelNode.find("[name='range']").prop('disabled', false);
    panelNode.find("[name='step']").prop('disabled', false);
    panelNode.find("[name='beginning']").prop('disabled', false);
    panelNode.find("[name='interval']").prop('disabled', false);
  } else {
    panelNode.find("[name='list']").prop('disabled', false);
    panelNode.find("[name='range']").prop('disabled', true);
    panelNode.find("[name='step']").prop('disabled', true);
    panelNode.find("[name='beginning']").prop('disabled', true);
    panelNode.find("[name='interval']").prop('disabled', true);
    panelNode.find("[name='list']").prop('value', config.list.toString());
  }

  if (config.type === 'point') {
    panelNode.find("[name='type'][value='point']").prop('checked', true);
    panelNode.find("[name='first_pos']").prop('disabled', true);
    panelNode.find("[name='first_pos']").val('');
  } else {
    panelNode.find("[name='type'][value='range']").prop('checked', true);
    panelNode.find("[name='first_pos']").prop('disabled', false);
  }

  if (config.cloud === 'always') panelNode.find("[name='cloud'][value='yes']").prop('checked', true);
  else if (config.cloud === 'click') panelNode.find("[name='cloud'][value='click']").prop('checked', true);
  else panelNode.find("[name='cloud'][value='no']").prop('checked', true);

  if (config.orient === 'vertical') panelNode.find("[name='orient'][value='vertical']").prop('checked', true);
  else panelNode.find("[name='orient'][value='horizontal']").prop('checked', true);

  if (!config.scale) {
    panelNode.find("[name='scale'][value='no']").prop('checked', true);
    panelNode.find("[name='interval']").prop('value', '');
    panelNode.find("[name='interval']").prop('disabled', true);
  } else {
    panelNode.find("[name='scale'][value='yes']").prop('checked', true);
    panelNode.find("[name='interval']").prop('disabled', false);
    panelNode.find("[name='interval']").prop('value', config.scaleInterval);
  }

  panelNode.find("[name='beginning']").prop('value', config.rangeStart);
  panelNode.find("[name='range']").prop('value', config.rangeOffset);
  panelNode.find("[name='step']").prop('value', config.step);
}

export default initDemo;
