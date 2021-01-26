import jQuery from "jquery";
import "../src/range-slider-plugin/range-slider"


let inputData = {orient: "horizontal", type: "range", origin: 10, range: 100, step : 1, scale: true, scaleInterval: 20, cloud: "test", };

let inputDataList = {orient: "vertical", type: "point", scale: true, cloud: "test", list: ["one", "two", "three", "four", "five"]};

document.body.innerHTML =  '<div style="width:100px; height:50px"> </div>';
let node =jQuery("div")

describe("Creation of the slider object", () => {
  test("it check that the slider object create correctly", () => {
    let createdObject = node.RangeSlider(inputData)

    expect(createdObject).toHaveProperty("model");
    expect(createdObject).toHaveProperty("presenter");
    expect(createdObject).toHaveProperty("view");
    expect(createdObject).toHaveProperty("config");

  })
  
  test("it check the creation of object for list", ()=>{
    let createdObject = node.RangeSlider(inputDataList)
    expect(createdObject.config.origin).toEqual(0)
    expect(createdObject.config.range).toEqual(inputDataList.list.length-1)
    expect(createdObject.config.step).toEqual(1)
    
  })

  test("it check the correctness of the coordinates. if they are entered incorrectly the constructor should have formatted them", ()=>{
    for(let n = 0; n<55; n++){
        let createdObject = node.RangeSlider(inputData)
        let origin = createdObject.config.origin
        let range = createdObject.config.range
        let start = Math.random() >= 0.5 ? Math.round(Math.random()*100) : -Math.round(Math.random()*100)
        let end = Math.random() >= 0.5 ? Math.round(Math.random()*100) : -Math.round(Math.random()*100)
        createdObject.init(start, end)
        let fixedStart  = createdObject.config.value[0] - origin
        let fixedEnd = createdObject.config.value[1] - origin
  
        expect([0,start-origin, fixedEnd-1, range-1]).toContain(fixedStart)
        expect(fixedStart).toBeGreaterThanOrEqual(0);

        expect([1, end-origin, range]).toContain(fixedEnd)
        expect(fixedEnd).toBeLessThanOrEqual(range)

        expect(fixedStart).toBeLessThan(fixedEnd);
    }
  });

  test("it check the function of initialization and rendering of elements", ()=>{
    let createdObject = node.RangeSlider(inputData)

    expect(createdObject.view.element).not.toBeTruthy()
    expect(createdObject.view.tumblers.elements).not.toBeTruthy()
    expect(createdObject.view.line.element).not.toBeTruthy()
    expect(createdObject.view.selected.element).not.toBeTruthy()
    expect(createdObject.view.scale.element).not.toBeTruthy()
    createdObject.init()
    expect(createdObject.view.element).toBeTruthy()
    expect(createdObject.view.tumblers.elements).toBeTruthy()
    expect(createdObject.view.line.element).toBeTruthy()
    expect(createdObject.view.selected.element).toBeTruthy()
    expect(createdObject.view.scale.element).toBeTruthy()
  });

  test("it checks that the layers are connected correctly", ()=>{
    //проверка закольцованности
    let createdObject = node.RangeSlider(inputData)
    let lastLink = createdObject.view.updateView = jest.fn()
    createdObject.init()
    createdObject.view.callback({})
    expect(lastLink).toBeCalled()

    //проверка того, что презентер пробрасывает данные
    let createdObject2 = node.RangeSlider(inputData)
    let modelReceiver = createdObject2.model.updateConfig = jest.fn()
    let testObject = {a: "string", b: 55, c: true }
    createdObject2.init()
    createdObject2.view.callback(testObject)
    expect(modelReceiver).toHaveBeenCalledWith(testObject)
  });
});

describe("Slider functioning", ()=>{
  describe("data processing", ()=>{
    test("range: 100, step: 1, method: standart", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      createdObject.init()
      let ViewUpdate = createdObject.view.updateView = jest.fn() 

      createdObject.view.callback({startPos: 25, endPos: 40, method: "drag"})
      expect(ViewUpdate).toBeCalledWith(25, 40)
      createdObject.view.callback({startPos: -10, endPos: 120, method: "drag"})
      expect(ViewUpdate).toBeCalledWith(0, 100)
    })
    
    test("range: 100, step: 1, method: tepping", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.view.updateView = jest.fn()
      createdObject.init()

      createdObject.view.callback({startPos: 1, endPos: -1, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(1, 99)

      createdObject.view.callback({startPos: +50, endPos: -70, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(28, 29)
    })
    
    test("range: 100, step: 1, method: scaleClick", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      createdObject.init()
      let ViewUpdate = createdObject.view.updateView = jest.fn()

      createdObject.view.callback({startPos: 50, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(40, 100)

      createdObject.view.callback({startPos: 90, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(40, 80)    
    })
    
    test("range: 100, step: 1, method: direct", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      createdObject.init()
      let ViewUpdate = createdObject.view.updateView = jest.fn()

      createdObject.view.callback({startPos: 20, endPos: 70, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(10, 60)

      createdObject.view.callback({endPos: 15, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(10, 11)

      createdObject.view.callback({startPos: 20, endPos: 15, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(4, 5)      
    })

    test("range: 60, step: 12, method: standart", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      createdObject.config.range = 60 
      createdObject.config.step = 12
      
      createdObject.init()
      let ViewUpdate = createdObject.view.updateView = jest.fn()

      createdObject.view.callback({startPos: 20, endPos: 50, method: "drag"})
      expect(ViewUpdate).toBeCalledWith(20, 60)
      createdObject.view.callback({endPos: 28, method: "drag"})
      expect(ViewUpdate).toBeCalledWith(20, 40)
      createdObject.view.callback({startPos: -12, method: "drag"})
      expect(ViewUpdate).toBeCalledWith(0, 40)
      createdObject.view.callback({endPos: 90, method: "drag"})
      expect(ViewUpdate).toBeCalledWith(0, 100)
    })
    
    test("range: 60, step: 12, method: tepping", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      createdObject.config.range = 60 
      createdObject.config.step = 12

      createdObject.init()
      let ViewUpdate = createdObject.view.updateView = jest.fn()

      createdObject.view.callback({startPos: 1, endPos: -1, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(20, 80)

      createdObject.view.callback({startPos: 2, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(60, 80)

      let newViewUpdate = createdObject.view.updateView = jest.fn()
      createdObject.view.callback({endPos: -1, method: "tepping"})
      expect(newViewUpdate).not.toBeCalled()
    })
    
    test("range: 60, step: 12, method: scaleClick", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      createdObject.config.range = 60 
      createdObject.config.step = 12

      let ViewUpdate = createdObject.view.updateView = jest.fn()
      createdObject.init()

      createdObject.view.callback({startPos: 22, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(20, 100)
      createdObject.view.callback({startPos: 46, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(20, 60)
      createdObject.view.callback({startPos: 10, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(0, 60)
    })
    
    test("range: 60, step: 12, method: direct", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      createdObject.config.range = 60 
      createdObject.config.step = 12

      createdObject.init()
      let ViewUpdate = createdObject.view.updateView = jest.fn()

      createdObject.view.callback({startPos: 35, endPos: 71, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(100/60 * 25, 100)

      createdObject.view.callback({startPos: -20, endPos: 18, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(0, 100/60 * 8) 
    })
  })
})