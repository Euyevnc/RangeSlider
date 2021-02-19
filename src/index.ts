import "./main.scss"
import "../types/index.d"

import {View} from "./View/View"
import {Model} from "./Model/Model"
import {Presenter} from "./Presenter/Presenter"

import {Config} from "./Config/Config"
import {Observer} from "./Observer/Observer"

let sliderInst = (function($){
    $.fn.rangeSlider = function(options:object) {
        let sliderObjects: Array<Object> = []
        this.each((i:number, elem:HTMLElement)=> {

            sliderObjects.push( createSlider(elem, options) )

        })
        
        if(sliderObjects.length == 1) return sliderObjects[0]
        else return sliderObjects
    }
} )(jQuery)


function createSlider(element: HTMLElement, options:Object){
    let slider = new sliderObject(element, options);
    return slider
}


class sliderObject implements sliderObjectI{
    root:HTMLElement;
    config: ConfigI;
    view: ViewI;
    presenter: PresenterI;
    model: ModelI;
    constructor(root:HTMLElement, options:Object){
        this.root = root
        this.config = new Config(options)

        this.view = new View(this.root, this.config, new Observer());
        this.model = new Model(this.config, new Observer())

        this.presenter = new Presenter(this.view, this.model);
    };
    init(firValue:number, secValue:number){
        this.presenter.connectLayers()
        this.view.render()  
        this.config.type == 'point' ? 
            this.model.updateConfig({startPos: this.config.origin, endPos: firValue,  method:"direct"})
            :
            this.model.updateConfig({startPos: firValue, endPos: secValue,  method:"direct"})
    }; 

    getValue(){
        return this.config.value
    };

    setValue(start:number, end:number){
        this.config.type == "point" ? 
            this.model.updateConfig({startPos: this.config.origin, endPos: start, method: "direct"})
            :
            this.model.updateConfig({startPos: start, endPos: end, method: "direct"})    
    }
}

export default sliderInst