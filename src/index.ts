import "./main.scss"

import {View} from "./View/View"
import {Model} from "./Model/Model"
import {Presenter} from "./Presenter/Presenter"

import {Config} from "./Config/Config"
import {Observer} from "./Observer/Observer"

class sliderObject implements sliderObjectI{
    config: ConfigI;
    view: ViewI;
    presenter: PresenterI;
    model: ModelI;
    constructor(root:HTMLElement, options:Object){
        this.config = new Config(options)

        this.view = new View(root, this.config, new Observer());
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
///////////
let sliderInst = (function($){
    $.fn.rangeSlider = function(options:object) {
        let sliderObjects: Array<Object> = []
        this.each((i:number, elem:HTMLElement)=> {

            sliderObjects.push( new sliderObject(elem, options) )

        })
        
        if(sliderObjects.length == 1) return sliderObjects[0]
        else return sliderObjects
    }
} )(jQuery)

export default sliderInst