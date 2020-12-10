import jQuery from "jquery";
import "../src/main"


let inputData = {orient: "vertical", type: "range", origin: 10, range: 90, start:10, end:30, step:3, scale: true, scaleInterval: 20, cloud: "test"};

document.body.innerHTML =  '<div> </div>';
let node =jQuery("div")

describe("Create slider object", () => {

    test("it check that the slider object create correctly", () => {
      let createdObject = node.RangeSlider(inputData)

      expect(createdObject).toHaveProperty("Model");
      expect(createdObject).toHaveProperty("Presenter");
      expect(createdObject).toHaveProperty("View");
      expect(createdObject.View).toHaveProperty("tumbler");
      expect(createdObject.View).toHaveProperty("line");
      expect(createdObject.View).toHaveProperty("selected");
      expect(createdObject.View).toHaveProperty("scale");

      expect(createdObject.Model.type).toEqual(inputData.type);
      expect(createdObject.Model.origin).toEqual(inputData.origin);
      expect(createdObject.View.scaleDisplay).toEqual(inputData.scale);
      expect(createdObject.View.orient).toEqual(inputData.orient);
      expect(createdObject.View.tumbler.cloud).toEqual(inputData.cloud);
      expect(createdObject.View.scale.interval).toEqual(inputData.scaleInterval);

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
    expect(createdObject.View.tumbler.elements).not.toBeTruthy()
    expect(createdObject.View.line.element).not.toBeTruthy()
    expect(createdObject.View.selected.element).not.toBeTruthy()
    expect(createdObject.View.scale.element).not.toBeTruthy()
    createdObject.init()
    expect(createdObject.View.element).toBeTruthy()
    expect(createdObject.View.tumbler.elements).toBeTruthy()
    expect(createdObject.View.line.element).toBeTruthy()
    expect(createdObject.View.selected.element).toBeTruthy()
    expect(createdObject.View.scale.element).toBeTruthy()
  });
  test("it checks that the layers are connected", ()=>{
    let createdObject = node.RangeSlider(inputData)

    let lastLink = createdObject.View.viewUpdate = jest.fn()
    createdObject.init()

    createdObject.View.tumblerShifted({})

    expect(lastLink).toBeCalled()
  });
});