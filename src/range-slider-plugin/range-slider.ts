import jQuery from "jquery";

import "./range-slider.scss"

export default (function($){
    $.fn.RangeSlider = function(options:object) {
        let sliderObjects: Array<Object> = []
        this.each((i:number, e:HTMLElement)=> {
            sliderObjects.push( createSlider(e,options) )
        })
        
        if(sliderObjects.length == 1) return sliderObjects[0]
        else return sliderObjects
    }
})(jQuery)

function createSlider(element: HTMLElement, options:object){
    let slider:sliderObjectI;
    slider = new sliderObject(element, options);
    return slider
}


class sliderObject{
    root:HTMLElement;
    config: ConfigI;
    view: ViewI;
    presenter: PresenterI;
    model: ModelI;
    constructor(root:HTMLElement, options:Object){
        this.root = root
        this.config = new Config(options)

        this.view = new View(this.root, this.config);
        this.model = new Model(this.config)

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


class Config implements ConfigI{
    type: string;
    orient: string;
    list: Array<number|string>;
    range: number;
    origin:number;
    step: number;
    scale: boolean;
    scaleInterval: number;
    cloud: string;
    value: Array<number>;
    constructor({type="range", origin = 0, range = 100,  start = 0, end=<number>null, step=1, 
    list=<Array <number|string>>[], orient = "horizontal", scale=true, cloud="click", scaleInterval=10}){
        
        let verifiedRange = list.length ? list.length - 1 : range;
        let verifiedOrigin = list.length ? 0 : origin;
        let verifiedStep = list.length ? 1 : step;
        let verifiedInterval = list.length ? 1 : scaleInterval;

        this.type = type,
        this.orient = orient,
        this.list = list,
        this.scale = scale,
        this.cloud = cloud,
        this.scaleInterval = verifiedInterval,
        this.range = verifiedRange,
        this.origin = verifiedOrigin,
        this.step = verifiedStep
    }
}

class Model implements ModelI{
    config: ConfigI;
    callback: Function;
    private start: number;
    private end: number;
    constructor(option:ConfigI){
        this.config = option
    }
    
    updateConfig(data: {startPos: number, endPos: number, method: string}):void{
        let config = this.config;
        let{type, origin, range, step} = config;
        let method = data.method

        let currentStart = this.start
        let currentEnd = this.end

        let newStart: number
        let newEnd: number

        if(method == 'direct') changeByDirect(data.startPos-origin, data.endPos - origin)
        else if(method == 'tepping') changeByTepping(data.startPos, data.endPos)
        else if(method == "drag") changeByDrag(data.startPos, data.endPos)
        else if(method == "scaleClick") changeByScaleClick(data.startPos)
        
        if(method !== "direct"){
            if(!newStart && newStart !== 0) newStart = currentStart
            if(!newEnd && newEnd !== 0) newEnd =currentEnd 

            let maxStartValue = type == 'point' ?
                0
                :
                Math.max( (Math.ceil(newEnd/step)*step - step), currentStart)

            let minEndValue = type == 'point' ? 
                0 
                :
                Math.min( (Math.floor(newStart/step)*step + step), currentEnd)

            newStart = Math.min(Math.max(newStart, 0), Math.max(maxStartValue, 0 ) )
            newEnd = Math.max( Math.min(newEnd, range), Math.min(minEndValue, range) )
        }
        
        if(newStart !== currentStart || newEnd !== currentEnd || method == 'direct'){
            this.start = newStart
            this.end = newEnd
            config.value = [newStart + origin, newEnd + origin]
            this.callback(100/range*newStart, 100/range*newEnd)
        }
        
        /////////////
        function changeByDirect(startPos:number, endPos:number){
            let maxStartValue = type == 'point' ? 0 : range
            let minEndValue = type == 'point' ? 0 : 1


            if(!startPos && startPos !== 0 ) newStart = currentStart || 0
            else newStart = startPos
            if(!endPos && endPos !== 0) newEnd = currentEnd || range
            else newEnd = endPos

            newStart =  Math.min( Math.max(newStart, 0), maxStartValue )
            newEnd = Math.min(Math.max(newEnd , 0), range)

            if(newStart>=newEnd && !(newEnd == 0 && type == 'point')){
                newEnd = currentEnd
                newStart = currentStart 
            }
        }
        function changeByTepping(startPos:number, endPos:number){
            if(startPos){ 
                if(startPos<0) newStart =  Math.ceil(currentStart/step)*step + step*startPos
                if(startPos>0) newStart =  Math.floor(currentStart/step)*step + step*startPos

            }
            if(endPos){
                if(endPos<0) newEnd =  Math.ceil(currentEnd/step)*step + step*endPos
                if(endPos>0) newEnd =  Math.floor(currentEnd/step)*step + step*endPos
            }
        }

        function changeByScaleClick(position:number){
            if(type == "point" || Math.abs(position - currentEnd)<=Math.abs(position - currentStart) ){
                newEnd = position
            }
            else newStart = position
        }
    
        function changeByDrag(startPos:number, endPos:number){
            if(startPos || startPos == 0){
                let cursorPosition = range/100*startPos
                let conditionOfTrigger 
                let cursorFarEnough = (cursorPosition - currentStart) >= step*0.8 || (currentStart - cursorPosition) >= step*0.8
                let cursorOverMakup = (cursorPosition%step > step*0.8 || cursorPosition%step <step*0.2 )
                conditionOfTrigger = cursorFarEnough || cursorOverMakup

                if(conditionOfTrigger){
                    newStart = Math.round(cursorPosition/step)*step
                }
            }
            if(endPos || endPos == 0){
                let cursorPosition = range/100*endPos
                let conditionOfTrigger 
                let cursorFarEnough = (cursorPosition - currentEnd  >= step*0.8) || (currentEnd - cursorPosition >= step*0.8)
                let cursorOverMakup = (cursorPosition%step > step*0.8 ||cursorPosition%step <step*0.2 )
                let cursorOverFinish = cursorPosition >= range
                conditionOfTrigger = cursorFarEnough || cursorOverMakup || cursorOverFinish
     
                if(conditionOfTrigger){
                    newEnd = Math.round(cursorPosition/step)*step
                }
            }     
        }
    }
};

class Presenter implements PresenterI{
    view: ViewI;
    model: ModelI;

    OptionalReactToInteraction: Function;
    OptionalReactToUpdate: Function;

    constructor(view:ViewI, model:ModelI){ 
        this.view = view;
        this.model = model

    }
    reactToInteraction(data: {startPos: number, endPos: number,  method: string}){            
        this.model.updateConfig(data)
        if(this.OptionalReactToInteraction) this.OptionalReactToInteraction(data)
    }
    reactToUpdate(firCoor:number, secCoor:number){
        this.view.updateView(firCoor, secCoor)
        if(this.OptionalReactToUpdate) this.OptionalReactToUpdate(firCoor, secCoor)

    };
    connectLayers(){
        this.model.callback = this.reactToUpdate.bind(this);
        this.view.callback = this.reactToInteraction.bind(this);
    }

}

class View implements ViewI{
    root:HTMLElement;
    element: HTMLElement;
    config: ConfigI;

    tumblers: Tumblers;
    line:     Line;
    selected: Selected;
    scale: Scale;
    callback: Function;

    constructor(root: HTMLElement, option: ConfigI){
        this.element
        this.root = root
        this.config = option
        this.tumblers = new Tumblers(root, option)
        this.line = new Line(option)
        this.selected = new Selected(option)
        this.scale = new Scale(option)
    }
    render():void{
        let root = this.root
        let config = this.config 
        let mainElement = this.element

        mainElement = document.createElement("div")
        mainElement.className = `range-slider  js-range-slider  range-slider_for_${config.orient}`
        mainElement.append( this.line.render() )
        mainElement.append( this.scale.render(this.callback) )
        this.tumblers.render(this.callback).forEach((el:HTMLElement)=>{
            this.line.element.append(el)
        })
        this.line.element.append(this.selected.render())

        this.root.innerHTML = ""
        this.element = mainElement;
        this.root.append(this.element);

        
    }
    updateView(firCoor:number, secCoor:number){
        
        this.tumblers.update(firCoor, secCoor)

        this.selected.update(firCoor, secCoor)

        this.scale.update(firCoor, secCoor)
    };
}

class Line{
    element: HTMLElement;
    config: ConfigI;
    constructor(option: ConfigI){
        this.config = option
    }

    render(){
        let config = this.config;

        let lineElement
        lineElement = document.createElement("div")
        lineElement.className = `range-slider__line  range-slider__line_for_${config.orient}`

        this.element = lineElement
        return this.element
    }
}
class Selected{
    element: HTMLElement;
    config: ConfigI;

    constructor(option: ConfigI){
        this.config = option
    }

    render(){
        let config = this.config;
        let selectedElement

        selectedElement = document.createElement("div")
        selectedElement.className = `range-slider__selected  range-slider__selected_for_${config.orient}`

        this.element = selectedElement 
        return this.element
    }
    update(firCoor: number, secCoor: number){
        let config = this.config;
        let selectedElement = this.element

        if(config.orient == "vertical"){
            selectedElement.style.bottom = firCoor + "%"
            selectedElement.style.top = 100 - secCoor + "%"
            
        }
        else{
            selectedElement.style.left = firCoor + "%"
            selectedElement.style.right = 100 - secCoor + "%"
        }
    }
}

class Tumblers{
    elements: HTMLDivElement[]
    root: HTMLElement;
    config: ConfigI;

    constructor(root: HTMLElement, option: ConfigI){
        this.config = option
        this.root = root
    }

    render(callback:Function){
        let root = this.root
        let config = this.config
        let list:Array<HTMLDivElement> = []
        let isFirstTumbler: boolean;

        
        for(let i=0; i<2; i++){ 
            let tumblerElement = document.createElement("div")
            tumblerElement.className = `range-slider__tumbler  range-slider__tumbler_for_${config.orient}`
            tumblerElement.tabIndex = 0;

            let cloud = createTheCloud()
            tumblerElement.append(cloud)
            tumblerElement.addEventListener("mousedown", handleTumblerMousedown)
            tumblerElement.addEventListener("keydown", handlerTumblerKeydown)
            tumblerElement.addEventListener("focus", handleTumblerFocus)
            if(config.type === "point" && i===0) tumblerElement.style.display = "none"
            list.push(tumblerElement)
        };

        this.elements = list
        return this.elements;

        /////////////////
        function createTheCloud(){
            let cloud: HTMLElement
            cloud = document.createElement("div")
            cloud.className = `js-range-slider__cloud   range-slider__cloud  range-slider__cloud_for_${config.orient}`
            cloud.append(document.createElement("b"))
            cloud.append(document.createElement("div"))
            if(config.cloud !== "always") cloud.style.display = "none"
            
            return cloud
        }
        function handleTumblerMousedown(e:MouseEvent){
            e.preventDefault()
            let tumbler = e.target as HTMLElement
            isFirstTumbler = tumbler == list[0]

            let cloud = tumbler.querySelector(".js-range-slider__cloud ") as HTMLElement
            if(config.cloud == "click") cloud.style.display = "block"

            root.addEventListener("mousemove", handleRootMove)
            document.onmouseup = e=>{
                root.removeEventListener("mousemove", handleRootMove);
                if(config.cloud == "click") cloud.style.display = "none"
                document.onmouseup = null;
            }
        }

        function handleRootMove(event:MouseEvent){
            let sliderZone= root.querySelector(".js-range-slider")
            let bias = config.orient === "vertical" ? 
                        -(event.clientY - sliderZone.getBoundingClientRect().bottom)/sliderZone.getBoundingClientRect().height * 100
                        //Минус тут нужен для реверса. так как шкала сверху вниз т.е. противонаправлена линии координат
                        :
                        (event.clientX - sliderZone.getBoundingClientRect().x)/sliderZone.getBoundingClientRect().width * 100 
            if (isFirstTumbler){
                callback({startPos: bias, method: 'drag'})
            }
            else(callback({endPos: bias , method: 'drag'}) )
        }

        function handleTumblerFocus(event:FocusEvent){
            let tumbler = (<HTMLElement>event.target)
            let cloud = tumbler.querySelector(".js-range-slider__cloud ") as HTMLElement
            if(config.cloud == "click") cloud.style.display = "block"
            
            tumbler.onblur = e=>{
                if(config.cloud == "click") cloud.style.display = "none";
                (<HTMLElement>e.target).onblur = null
            }

        }

        function handlerTumblerKeydown(event:KeyboardEvent){    
            let tumbler = (<HTMLElement>event.target)
            isFirstTumbler = tumbler == list[0]

            if( (event.key === "ArrowDown" && config.orient ==="vertical") || (event.key === "ArrowLeft" && config.orient !=="vertical")){
                isFirstTumbler ? 
                        callback({startPos: -1, method: "tepping"})
                        :
                        callback({endPos:-1, method:"tepping"});
                event.preventDefault()
            } 
            else if( (event.key === "ArrowUp" && config.orient ==="vertical") || (event.key === "ArrowRight" && config.orient !=="vertical")){
                isFirstTumbler ? 
                        callback({startPos: 1, method: "tepping"})
                        :
                        callback({endPos:1, method:"tepping"});
                event.preventDefault()
            }
        }
    }

    update(firCoor: number, secCoor:number){
        let config = this.config
        let firEl = this.elements[0] as HTMLElement
        let secEl = this.elements[1] as HTMLElement;

        if(config.orient == "vertical"){
            firEl.style.bottom = firCoor + "%";
            secEl.style.bottom = secCoor  + "%"
        }
        else{
            firEl.style.left = firCoor + "%";
            secEl.style.left = secCoor  + "%"
        };
        updateClouds(firCoor, secCoor);

        ///////
        function updateClouds(firPerc:number, secPerc:number) {
            let firValue: string
            let secValue: string
            firValue = Math.round(config.range/100*firPerc+config.origin).toString()
            secValue = Math.round(config.range/100*secPerc+config.origin).toString()
    
            if(config.list.length){
                firValue  = config.list[+firValue].toString()
                secValue = config.list[+secValue].toString()
            }
        
            firEl.querySelector("b").innerText = firValue;
            secEl.querySelector("b").innerText = secValue;
        }
    }
};

class Scale{
    element: HTMLElement;
    config: ConfigI;

    constructor(option: ConfigI){
        this.config = option
    }
    render(callback:Function){
        let config = this.config
        let intervals = Math.ceil(config.range/ config.scaleInterval)
        let isList = Boolean(config.list.length)

        let scaleElement =  document.createElement("div")
        scaleElement.className = `range-slider__scale  range-slider__scale_for_${config.orient}`;
        
        createCell(config.origin)
        for( let i=1; i<intervals; i++){
            if(i !==intervals-1) {
                createCell(i*config.scaleInterval+config.origin)
            }
            else createCell(i*config.scaleInterval+config.origin).style.flexShrink = "1"
        };
        config.orient == "vertical" ? 
            createCell(config.range+config.origin).style.height = "0px"
            :
            createCell(config.range+config.origin).style.width = "0px"
        ;

        if(!config.scale) scaleElement.style.display = "none"
        this.element = scaleElement
        return this.element;

        ////////////
        function createCell(int:number){
            let cell = document.createElement("span")
            cell.className = (`js-range-slider__cell range-slider__cell  range-slider__cell_for_${config.orient}`)
            if(config.orient == "vertical"){
                cell.style.height = config.scaleInterval/config.range*100 + "%"
            }
            else{
                cell.style.width = config.scaleInterval/config.range*100 + "%"
            };
            cell.classList.add(`range-slider__cell_meaning_${int}`)
            cell.setAttribute("value", `${int}`)

            let amountContainer = document.createElement("span")
            amountContainer.innerHTML = isList ?
                config.list[int].toString()
                :
                int.toString();
            ;
            amountContainer.tabIndex = 0
            amountContainer.addEventListener("click", handlerCellClick)
            amountContainer.addEventListener("keydown", handlerCellKeydown)
            cell.append(amountContainer);

            scaleElement.append(cell);
            return cell
        }

        function handlerCellClick(event:MouseEvent){
            let value = +(<HTMLElement>event.target).closest(".range-slider__cell").getAttribute("value") - config.origin
            callback({startPos: value, method: "scaleClick"})
        }
        function handlerCellKeydown(event:KeyboardEvent){
            if(event.code!=='Enter') return
            let value = +(<HTMLElement>event.target).closest(".range-slider__cell").getAttribute("value") - config.origin
            callback({startPos: value, method: "scaleClick"})  
        }
    }
    update(firCoor: number, secCoor:number){
        let config = this.config
        let scaleElement = this.element

        let firValue = config.range/100*firCoor + config.origin
        let secValue = config.range/100*secCoor + config.origin
        scaleElement.querySelectorAll(".js-range-slider__cell").forEach(el=>{
            let elem = el as HTMLElement
            let valueInCell = +el.getAttribute("value")
            if(valueInCell>= firValue && valueInCell<=secValue ){
                elem.classList.add("range-slider__cell_status_active")
            }
            else{
                elem.classList.remove("range-slider__cell_status_active")
            } 
        })
    }
}


