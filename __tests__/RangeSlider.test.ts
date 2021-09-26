/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable max-len */
import '../src/index';

const testData = {
  orient: 'horizontal', type: 'range', rangeStart: 10, rangeOffset: 100, step: 1, scale: true, scaleInterval: 20, cloud: 'click',
};
const testDataList = {
  orient: 'vertical', type: 'point', scale: true, cloud: 'none', list: ['one', 'two', 'three', 'four', 'five'],
};

document.body.innerHTML = '<div style="width:100px; height:50px"> </div>';
const node = jQuery('div');

describe('Creation of the slider object', () => {
  test('it check that the slider object create correctly', () => {
    const createdSlider = node.rangeSlider(testData);

    const config = createdSlider.getConfig();

    expect(config.orient).toBe('horizontal');
    expect(config.type).toBe('range');
    expect(config.scale).toBe(true);
    expect(config.cloud).toBe('click');
  });

  test('it check the creation of object for list', () => {
    const createdSlider = node.rangeSlider(testDataList);
    const config = createdSlider.getConfig();
    expect(config.rangeStart).toEqual(0);
    expect(config.rangeOffset).toEqual(testDataList.list.length - 1);
    expect(config.step).toEqual(1);
    expect(config.type).toBe('point');
  });

  test('it check the correctness of the coordinates. if they are entered incorrectly the constructor should have formatted them', () => {
    const { rangeOffset, rangeStart } = testData;
    for (let n = 0; n < 55; n += 1) {
      const initStart = Math.random() >= 0.5
        ? Math.round(Math.random() * 100)
        : -Math.round(Math.random() * 100);

      const initEnd = Math.random() >= 0.5
        ? Math.round(Math.random() * 100)
        : -Math.round(Math.random() * 100);

      const createdSlider = node.rangeSlider({ ...testData, start: initStart, end: initEnd });

      const { start, end } = createdSlider.getValues();

      expect([initStart, rangeStart, end - 1]).toContain(start);
      expect([initEnd, rangeOffset + rangeStart, rangeStart + 1]).toContain(end);

      expect(start).toBeGreaterThanOrEqual(rangeStart);
      expect(start).toBeLessThan(end);

      expect(end).toBeGreaterThan(start);
      expect(end).toBeLessThanOrEqual(rangeStart + rangeOffset);
    }
  });

  test('it checks that the callbacks work correctly', () => {
    const createdSlider = node.rangeSlider(testData);

    const testValueCallback = jest.fn();
    createdSlider.addValuesUpdateListener(testValueCallback);
    createdSlider.setValues();
    expect(testValueCallback).toBeCalled();

    const testConfigCallback = jest.fn();
    createdSlider.addConfigChangeListener(testConfigCallback);

    createdSlider.changeConfig({ rangeOffset: 200 });
    expect(testConfigCallback).toBeCalled();
  });

  test('it checks that the layers are connected correctly', () => {
    const createdSlider = node.rangeSlider(testData);

    const testViewUpdateCallback = jest.fn();
    createdSlider.addValuesUpdateListener(testViewUpdateCallback);

    const view = (createdSlider as any)['view'];
    view.updateView = testViewUpdateCallback;
    view.observer.broadcast('drag', { startPosition: 100500 });
    expect(testViewUpdateCallback).toBeCalled();
  });
});

describe('Slider functioning', () => {
  describe('data processing', () => {
    test('range: 100, step: 1, method: direct', () => {
      const createdSlider = node.rangeSlider(testData);

      const testValueCallback = jest.fn();
      createdSlider.addValuesUpdateListener(testValueCallback);

      createdSlider.setValues(20, 70);
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 10, end: 60 }, values: { start: 20, end: 70 } });

      createdSlider.setValues(93, 21);
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 10, end: 11 }, values: { start: 20, end: 21 } });
    });

    test('range: 100, step: 1, method: drag', () => {
      const createdSlider = node.rangeSlider(testData);

      const view = (createdSlider as any)['view'];

      const testValueCallback = jest.fn();
      createdSlider.addValuesUpdateListener(testValueCallback);

      view.observer.broadcast('drag', { startPosition: 25, endPosition: 40 });
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 25, end: 40 }, values: { start: 35, end: 50 } });

      view.observer.broadcast('drag', { startPosition: -10, endPosition: 120 });
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 0, end: 100 }, values: { start: 10, end: 110 } });
    });

    test('range: 100, step: 1, method: stride', () => {
      const createdSlider = node.rangeSlider(testData);

      const view = (createdSlider as any)['view'];

      const testValueCallback = jest.fn();
      createdSlider.addValuesUpdateListener(testValueCallback);

      view.observer.broadcast('stride', { startPosition: 1, endPosition: 1 });
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 1, end: 100 }, values: { start: 11, end: 110 } });

      view.observer.broadcast('stride', { startPosition: -2, endPosition: -1 });
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 0, end: 99 }, values: { start: 10, end: 109 } });
    });

    test('range: 60, step: 12, method: scaleClick', () => {
      const createdSlider = node.rangeSlider({ ...testData, rangeOffset: 60, step: 12 });

      const view = (createdSlider as any)['view'];

      const testValueCallback = jest.fn();
      createdSlider.addValuesUpdateListener(testValueCallback);

      view.observer.broadcast('scaleClick', { startPosition: 20, endPosition: 50 });
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 20, end: 60 }, values: { start: 22, end: 46 } });

      view.observer.broadcast('scaleClick', { endPosition: 28 });
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 20, end: 40 }, values: { start: 22, end: 34 } });

      view.observer.broadcast('scaleClick', { startPosition: 0 });
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 0, end: 40 }, values: { start: 10, end: 34 } });

      view.observer.broadcast('scaleClick', { endPosition: 90 });
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 0, end: 100 }, values: { start: 10, end: 70 } });
    });

    test('range: 60, step: 12, method: stride', () => {
      const createdSlider = node.rangeSlider({ ...testData, rangeOffset: 60, step: 12 });

      const view = (createdSlider as any)['view'];

      const testValueCallback = jest.fn();
      createdSlider.addValuesUpdateListener(testValueCallback);

      view.observer.broadcast('stride', { startPosition: 1, endPosition: -1 });
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 20, end: 80 }, values: { start: 22, end: 58 } });

      view.observer.broadcast('stride', { startPosition: 2, endPosition: -1 });
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 40, end: 60 }, values: { start: 34, end: 46 } });
    });

    test('range: 60, step: 12, method: direct', () => {
      const createdSlider = node.rangeSlider({ ...testData, rangeOffset: 60, step: 12 });

      const testValueCallback = jest.fn();
      createdSlider.addValuesUpdateListener(testValueCallback);

      createdSlider.setValues(35, 75);
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: (100 / 60) * 25, end: 100 }, values: { start: 35, end: 70 } });

      createdSlider.setValues(-20, 19);
      expect(testValueCallback).toBeCalledWith({ coordinates: { start: 0, end: (100 / 60) * 9 }, values: { start: 10, end: 19 } });
    });
  });
});
