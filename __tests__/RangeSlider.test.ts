import jQuery from "jquery";
import "../src/RangeSlider/RangeSlider"


let inputData = {orient: "horizontal", type: "range", origin: 10, range: 100, start:10, end:30, step : 1, scale: true, scaleInterval: 20, cloud: "test", };

let inputDataList = {orient: "vertical", type: "point", scale: true, cloud: "test", list: ["one", "two", "three", "four", "five"]};

document.body.innerHTML =  '<div style="width:100px; height:50px"> </div>';
let node =jQuery("div")


describe("Creation of the slider object", () => {

  test("it check that the slider object create correctly", () => {
    let createdObject = node.RangeSlider(inputData)

    expect(createdObject).toHaveProperty("Model");
    expect(createdObject).toHaveProperty("Presenter");
    expect(createdObject).toHaveProperty("View");
    expect(createdObject.View).toHaveProperty("tumblers");
    expect(createdObject.View).toHaveProperty("line");
    expect(createdObject.View).toHaveProperty("selected");
    expect(createdObject.View).toHaveProperty("scale");

    expect(createdObject.Model.type).toEqual(inputData.type);
    expect(createdObject.Model.origin).toEqual(inputData.origin);
    expect(createdObject.View.scale.display).toEqual(inputData.scale);
    expect(createdObject.View.orient).toEqual(inputData.orient);
    expect(createdObject.View.tumblers.cloud).toEqual(inputData.cloud);
    expect(createdObject.View.scale.interval).toEqual(inputData.scaleInterval);
  })
  
  test("it check the creation of object for list", ()=>{
    let createdObject = node.RangeSlider(inputDataList)
    expect(createdObject.Model.origin).toEqual(0)
    expect(createdObject.Model.range).toEqual(inputDataList.list.length-1)
    expect(createdObject.Model.step).toEqual(1)
    
  })

  test("it check the correctness of the coordinates. if they are entered incorrectly the constructor should have formatted them", ()=>{
    for(let n = 0; n<55; n++){
        let dataClone = {...inputData}
        
        dataClone.start = Math.random() >= 0.5 ? Math.round(Math.random()*100) : -Math.round(Math.random()*100)
        dataClone.end = Math.random() >= 0.5 ? Math.round(Math.random()*100) : -Math.round(Math.random()*100)
        
        let createdObject = node.RangeSlider(dataClone)

        expect([dataClone.start-dataClone.origin, 0, dataClone.range-dataClone.step]).toContain(createdObject.Model.start);
        expect(createdObject.Model.start).toBeLessThan(createdObject.Model.end);
        expect(createdObject.Model.start).toBeGreaterThanOrEqual(0);

        expect([dataClone.end-dataClone.origin, dataClone.range, (createdObject.Model.start)+1]).toContain(createdObject.Model.end)
        expect(createdObject.Model.end).toBeGreaterThan(createdObject.Model.start)
        expect(createdObject.Model.end).toBeLessThanOrEqual(dataClone.range)
    }
  });

  test("it check the function of initialization and rendering of elements", ()=>{
    let createdObject = node.RangeSlider(inputData)

    expect(createdObject.View.element).not.toBeTruthy()
    expect(createdObject.View.tumblers.elements).not.toBeTruthy()
    expect(createdObject.View.line.element).not.toBeTruthy()
    expect(createdObject.View.selected.element).not.toBeTruthy()
    expect(createdObject.View.scale.element).not.toBeTruthy()
    createdObject.init()
    expect(createdObject.View.element).toBeTruthy()
    expect(createdObject.View.tumblers.elements).toBeTruthy()
    expect(createdObject.View.line.element).toBeTruthy()
    expect(createdObject.View.selected.element).toBeTruthy()
    expect(createdObject.View.scale.element).toBeTruthy()
  });

  test("it checks that the layers are connected correctly", ()=>{
    //проверка закольцованности
    let createdObject = node.RangeSlider(inputData)
    let lastLink = createdObject.View.viewUpdate = jest.fn()
    createdObject.init()
    createdObject.View.callback({})
    expect(lastLink).toBeCalled()

    //проверка того, что презентер пробрасывает данные
    let createdObject2 = node.RangeSlider(inputData)
    let modelReceiver = createdObject2.Model.update = jest.fn()
    let testObject = {a: "string", b: 55, c: true }
    createdObject2.init()
    createdObject2.View.callback(testObject)
    expect(modelReceiver).toHaveBeenCalledWith(testObject)
  });
});

describe("Slider functioning", ()=>{
  describe("data processing", ()=>{
    test("range: 100, step: 1, method: standart", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.View.viewUpdate = jest.fn()
      createdObject.init()
      

      createdObject.View.callback({startPos: 25, endPos: 40})
      expect(ViewUpdate).toBeCalledWith(25, 40)
      createdObject.View.callback({startPos: -10, endPos: 120})
      expect(ViewUpdate).toBeCalledWith(0, 100)
    })
    
    test("range: 100, step: 1, method: tepping", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.View.viewUpdate = jest.fn()
      createdObject.init()

      createdObject.View.callback({startPos: 1, endPos: -1, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(1, 19)

      createdObject.Model.start = 0 
      createdObject.Model.end = 100 
      createdObject.View.callback({startPos: -1, endPos: +1, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(0, 100)
    })
    
    test("range: 100, step: 1, method: scaleClick", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.View.viewUpdate = jest.fn()
      createdObject.init()

      createdObject.View.callback({startPos: 50, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(0, 50)

      createdObject.View.callback({startPos: 20, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(20, 50)    
    })
    
    test("range: 100, step: 1, method: direct", ()=>{  
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.View.viewUpdate = jest.fn()
      createdObject.init()

      createdObject.View.callback({startPos: 20, endPos: 70, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(10, 60)

      createdObject.View.callback({startPos: 20, endPos: 5, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(10, 11)      
    })

    test("range: 60, step: 12, method: standart", ()=>{  
      inputData.range = 60;
      inputData.step = 12;
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.View.viewUpdate = jest.fn()
      createdObject.init()

      createdObject.View.callback({startPos: 20, endPos: 50})
      expect(ViewUpdate).toBeCalledWith(20, 60)
      createdObject.View.callback({endPos: 28})
      expect(ViewUpdate).toBeCalledWith(20, 40)
      createdObject.View.callback({startPos: -12})
      expect(ViewUpdate).toBeCalledWith(0, 40)
      createdObject.View.callback({endPos: 90})
      expect(ViewUpdate).toBeCalledWith(0, 100)
    })
    
    test("range: 60, step: 12, method: tepping", ()=>{  
      inputData.range = 60;
      inputData.step = 12;
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.View.viewUpdate = jest.fn()
      createdObject.init()

      createdObject.View.callback({startPos: 1, endPos: -1, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(20, 40)

      createdObject.Model.start = 0 
      createdObject.Model.end = 60 
      createdObject.View.callback({startPos: -1, endPos: +1, method: "tepping"})
      expect(ViewUpdate).toBeCalledWith(0, 100)
    })
    
    test("range: 60, step: 12, method: scaleClick", ()=>{  
      inputData.range = 60;
      inputData.step = 12;
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.View.viewUpdate = jest.fn()
      createdObject.init()

      createdObject.View.callback({startPos: 12, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(0, 20)
      createdObject.View.callback({startPos: 36, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(0, 60)
      createdObject.View.callback({startPos: 12, method: "scaleClick"})
      expect(ViewUpdate).toBeCalledWith(20, 60)
    })
    
    test("range: 60, step: 12, method: direct", ()=>{  
      inputData.range = 60;
      inputData.step = 12;
      let createdObject = node.RangeSlider(inputData)
      let ViewUpdate = createdObject.View.viewUpdate = jest.fn()
      createdObject.init()

      createdObject.View.callback({startPos: 25, endPos: 61, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(100/60 * 15, 100/60 * 51)

      createdObject.View.callback({startPos: -20, endPos: 8, method: "direct"})
      expect(ViewUpdate).toBeCalledWith(0, 100/60 * 1) 
    })
  })
  describe("it check the occurrence of events and their transfer to the presenter", ()=>{
    let createdObject = node.RangeSlider(inputData)
    let tumblersReaction = createdObject.Presenter.shiftReact = jest.fn()
    createdObject.init()

    test("mouse move event", ()=>{
      let md = new MouseEvent("mousedown")
      let mm = new MouseEvent("mousemove", {bubbles: true})

      createdObject.View.tumblers.elements[0].dispatchEvent(md)
      createdObject.View.element.dispatchEvent(mm)
      expect(tumblersReaction).toBeCalled()
    })
    test("mouse click event", ()=>{
      let mc = new MouseEvent("click")
      createdObject.View.scale.element.querySelector(".Scale__cell").dispatchEvent(mc)
      expect(tumblersReaction).toBeCalled()
    })
    test("keyboard event", ()=>{
      let f = new FocusEvent("focus")
      let kd = new KeyboardEvent("keydown", {key: "ArrowLeft", code: "ArrowLeft"})

      createdObject.View.tumblers.elements[0].dispatchEvent(f)
      document.dispatchEvent(kd)
      expect(tumblersReaction).toBeCalled()
    })
  })
})