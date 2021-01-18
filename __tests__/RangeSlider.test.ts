import jQuery from "jquery";
import "../src/RangeSlider/RangeSlider"


let inputData = {orient: "horizontal", type: "range", origin: 10, range: 100, start:10, end:30, step : 1, scale: true, scaleInterval: 20, cloud: "test", };

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
        let dataClone = {...inputData}
        
        dataClone.start = Math.random() >= 0.5 ? Math.round(Math.random()*100) : -Math.round(Math.random()*100)
        dataClone.end = Math.random() >= 0.5 ? Math.round(Math.random()*100) : -Math.round(Math.random()*100)
        
        let createdObject = node.RangeSlider(dataClone)

        expect([dataClone.start-dataClone.origin, 0, dataClone.range-dataClone.step]).toContain(createdObject.config.start);
        expect(createdObject.config.start).toBeLessThan(createdObject.config.end);
        expect(createdObject.config.start).toBeGreaterThanOrEqual(0);

        expect([dataClone.end-dataClone.origin, dataClone.range, (createdObject.config.start)+1]).toContain(createdObject.config.end)
        expect(createdObject.config.end).toBeGreaterThan(createdObject.config.start)
        expect(createdObject.config.end).toBeLessThanOrEqual(dataClone.range)
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
      let ViewUpdate = createdObject.view.updateView = jest.fn()
      createdObject.init()
      

      createdObject.view.callback({startPos: 25, endPos: 40})
      expect(ViewUpdate).toBeCalledWith(25, 40)
      createdObject.view.callback({startPos: -10, endPos: 120})
      expect(ViewUpdate).toBeCalledWith(0, 100)
    })
    
    test("range: 100, step: 1, method: tepping", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.view.updateView = jest.fn()
      createdObject.init()

      createdObject.view.callback({startPos: 1, endPos: -1, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(1, 19)

      createdObject.config.start = 0 
      createdObject.config.end = 100 
      createdObject.view.callback({startPos: -1, endPos: +1, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(0, 100)
    })
    
    test("range: 100, step: 1, method: scaleClick", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.view.updateView = jest.fn()
      createdObject.init()

      createdObject.view.callback({startPos: 50, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(0, 50)

      createdObject.view.callback({startPos: 20, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(20, 50)    
    })
    
    test("range: 100, step: 1, method: direct", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.view.updateView = jest.fn()
      createdObject.init()

      createdObject.view.callback({startPos: 20, endPos: 70, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(10, 60)

      createdObject.view.callback({startPos: 20, endPos: 5, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(10, 60)      
    })

    test("range: 60, step: 12, method: standart", ()=>{  
      inputData.range = 60;
      inputData.step = 12;
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.view.updateView = jest.fn()
      createdObject.init()

      createdObject.view.callback({startPos: 20, endPos: 50})
      expect(ViewUpdate).toBeCalledWith(20, 60)
      createdObject.view.callback({endPos: 28})
      expect(ViewUpdate).toBeCalledWith(20, 40)
      createdObject.view.callback({startPos: -12})
      expect(ViewUpdate).toBeCalledWith(0, 40)
      createdObject.view.callback({endPos: 90})
      expect(ViewUpdate).toBeCalledWith(0, 100)
    })
    
    test("range: 60, step: 12, method: tepping", ()=>{  
      inputData.range = 60;
      inputData.step = 12;
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.view.updateView = jest.fn()
      createdObject.init()

      createdObject.view.callback({startPos: 1, endPos: -1, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(20, 40)

      createdObject.config.start = 0 
      createdObject.config.end = 60 
      createdObject.view.callback({startPos: -1, endPos: +1, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(0, 100)
    })
    
    test("range: 60, step: 12, method: scaleClick", ()=>{  
      inputData.range = 60;
      inputData.step = 12;
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.view.updateView = jest.fn()
      createdObject.init()

      createdObject.view.callback({startPos: 12, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(0, 20)
      createdObject.view.callback({startPos: 36, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(0, 60)
      createdObject.view.callback({startPos: 12, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(20, 60)
    })
    
    test("range: 60, step: 12, method: direct", ()=>{  
      inputData.range = 60;
      inputData.step = 12;
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.view.updateView = jest.fn()
      createdObject.init()

      createdObject.view.callback({startPos: 25, endPos: 61, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(100/60 * 15, 100/60 * 51)

      createdObject.view.callback({startPos: -20, endPos: 8, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(0, 100/60 * 1) 
    })
  })
  describe("it check the occurrence of events and their transfer to the presenter", ()=>{
    let createdObject = node.RangeSlider(inputData)
    let tumblersReaction = createdObject.presenter.reactToInteraction = jest.fn()
    createdObject.init()

    test("mouse move event", ()=>{
      let md = new MouseEvent("mousedown")
      let mm = new MouseEvent("mousemove", {bubbles: true})

      createdObject.view.tumblers.elements[0].dispatchEvent(md)
      createdObject.view.element.dispatchEvent(mm)
      expect(tumblersReaction).toBeCalled()
    })
    test("mouse click event", ()=>{
      let mc = new MouseEvent("click")
      createdObject.view.scale.element.querySelector(".range-slider__cell").dispatchEvent(mc)
      expect(tumblersReaction).toBeCalled()
    })
    test("keyboard event", ()=>{
      let f = new FocusEvent("focus")
      let kd = new KeyboardEvent("keydown", {key: "ArrowLeft", code: "ArrowLeft"})

      createdObject.view.tumblers.elements[0].dispatchEvent(f)
      document.dispatchEvent(kd)
      expect(tumblersReaction).toBeCalled()
    })
  })
})