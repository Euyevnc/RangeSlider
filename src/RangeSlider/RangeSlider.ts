import jQuery from "jquery";

import "./RangeSlider.scss"

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
    config: sliderConfigI;
    view: ViewI;
    presenter: PresenterI;
    model: ModelI;
    constructor(root:HTMLElement, {type="range", origin = 0, range = 100,  start = 0, end=<number>null, 
                step=1, list=<Array <number|string>>[], orient = "horizontal", scale=true, cloud="click", scaleInterval=10}){
        
        let verifiedRange = list.length ? list.length - 1 : range;
        let verifiedOrigin = list.length ? 0 : origin;
        let verifiedStep = list.length ? 1 : step;
        let verifiedInterval = list.length ? 1 : scaleInterval;

        let verifiedStart = type == "point" ? 0 : Math.max(Math.min(start - verifiedOrigin, verifiedRange - verifiedStep), 0);
        let verifiedEnd = end === null ? verifiedRange : Math.min(verifiedRange, Math.max(type == "point" ? verifiedStart : (verifiedStart + verifiedStep), end - verifiedOrigin) );
        this.root = root;
        this.config = {
            type: type,
            orient: orient,
            list: list,
            scale: scale,
            cloud: cloud,
            scaleInterval: verifiedInterval,
            range: verifiedRange,
            origin: verifiedOrigin,
            step: verifiedStep,

            _start: verifiedStart,
            _end: verifiedEnd,
            value: [verifiedStart+verifiedOrigin, verifiedEnd+verifiedOrigin],

            set start(num:number){
                this.type == "range" ? 
                    this._start = Math.min(Math.max(Math.ceil(this.end/this.step)*this.step - this.step, 0), Math.max(num, 0) )
                    :
                    this._start = 0 
            },
            get start(){
                return this._start
            },
            set end(num:number){
                this.type == "range" ? 
                this._end = Math.max(Math.min(Math.floor(this.start/this.step)*this.step + this.step, this.range), Math.min(num, this.range) )
                :
                this._end = Math.max(this.start, Math.min(num, this.range) )
            },
            get end(){
                return this._end
            },
            
        },
        this.view = new View(this.root, this.config);
        this.model = new Model(this.config)
        this.presenter = new Presenter(this.view, this.model);
    };
    init(){
        this.presenter.connectLayers()
        this.view.render()  
        this.presenter.reactToInteraction({startPos: undefined, endPos:undefined,  method:"standart"})
    };
    getValue(){
        return this.config.value
    };
    setValue(start:number, end:number){
        this.presenter.reactToInteraction({startPos: start, endPos: end, method: "direct"})    
    }
}

class Model implements ModelI{
    config: sliderConfigI;
    callback: Function;

    constructor(option:sliderConfigI){
        this.config = option
        
    }
    
    updateConfig(data: {startPos: number, endPos: number, method: string}):void{
        let config = this.config;
        let{type, origin, range, step} = config;
        
        if(data.method == "direct") changeByDirective(data.startPos, data.endPos)
        else if(data.method == "tepping") changeByTepping(data.startPos, data.endPos)
        else if(data.method == "scaleClick") changeByScaleClick(data.startPos)
        else changeByDrag(data.startPos, data.endPos)

        config.value = [config.start + origin, config.end + origin]
        this.callback(100/range*config.start, 100/range*config.end)

        /////////////
        function changeByDirective(startPos:number, endPos:number){
            if(type == "point") {
                if(startPos< origin) this.config._end = 0
                else if(startPos> range + origin) this.config._end = range
                else if(startPos || startPos == 0)this.config._end = startPos - origin  
            }
            else{
                let newStart = startPos - origin || config.start
                let newEnd = (endPos || endPos == 0) ? endPos - origin : config.end
                if(newStart>=newEnd) return
                newStart = Math.min( Math.max(newStart, 0), range-1 )
                newEnd = Math.min(Math.max(newEnd, 1), range)
    
                config._start = newStart
                config._end = newEnd
                // Не знаю, стоило ли к приватным методам обращаться, но ситуация с этим способом 
                //ввода такова, что что-то иное придумать сложно
            }
        }

        function changeByTepping(startPos:number, endPos:number){
            if(startPos){
                config.start += config.step*startPos
            }
            if(endPos){
                config.end += config.step*endPos
            }
        }

        function changeByScaleClick(position:number){
            if(config.type == "point" || Math.abs(position - config.end)<=Math.abs(position - config.start) ){
                config.end = position
            }
            else config.start = position
        }
    
        function changeByDrag(startPos:number, endPos:number){
            let newStart = range/100*startPos 
            let newEnd = range/100*endPos
    
            if((newEnd -  config.end) >= step*0.7 || (config.end - newEnd) >=  config.step*0.7 || newEnd >= range){
                newEnd = Math.round(newEnd/step)*step
            }
            else newEnd = config.end
    
            if((newStart - config.start) >= step*0.7 || (config.start - newStart) >= step*0.7 || newStart<=0){
                newStart = Math.round(newStart/step)*step
            }
            else newStart = config.start
    
            config.end = newEnd
            config.start = newStart
            //Эту канитель со значениями new добавил уже для панели, чтобы на лету параметры слайдер удобно менять.
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
    config: sliderConfigI;

    tumblers: Tumblers;
    line:     Line;
    selected: Selected;
    scale: Scale;
    callback: Function;

    constructor(root: HTMLElement, option: sliderConfigI){
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
        this.root.append(mainElement);

        
    }
    updateView(firCoor:number, secCoor:number){
        
        this.tumblers.update(firCoor, secCoor)

        this.selected.update(firCoor, secCoor)

        this.scale.update(firCoor, secCoor)
    };
}

class Line{
    element: HTMLElement;
    config: sliderConfigI;
    constructor(option: sliderConfigI){
        this.config = option
    }

    render(){
        let config = this.config;

        let lineElement
        lineElement = document.createElement("div")
        lineElement.className = `range-slider__line  range-slider__line_for_${config.orient}`

        this.element = lineElement
        return lineElement
    }
}
class Selected{
    element: HTMLElement;
    config: sliderConfigI;

    constructor(option: sliderConfigI){
        this.config = option
    }

    render(){
        let config = this.config;
        let selectedElement

        selectedElement = document.createElement("div")
        selectedElement.className = `range-slider__selected  range-slider__selected_for_${config.orient}`

        this.element = selectedElement 
        return selectedElement
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
    config: sliderConfigI;

    constructor(root: HTMLElement, option: sliderConfigI){
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
                callback({startPos: bias})
            }
            else(callback({endPos: bias }) )
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
        updateClouds();

        ///////
        function updateClouds() {
            let firValue: string
            let secValue: string
            firValue = (config.start+config.origin).toString()
            secValue = (config.end+config.origin).toString()
    
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
    config: sliderConfigI;

    constructor(option: sliderConfigI){
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
            amountContainer.addEventListener("click", handlerCellClick)
            cell.append(amountContainer);

            scaleElement.append(cell);
            return cell
        }

        function handlerCellClick(event:MouseEvent){
            let value = +(<HTMLElement>event.target).closest(".range-slider__cell").getAttribute("value") - config.origin
            callback({startPos: value, method: "scaleClick"})
        }
    }
    update(firCoor: number, secCoor:number){
        let config = this.config
        let scaleElement = this.element

        scaleElement.querySelectorAll(".js-range-slider__cell").forEach(el=>{
            let elem = el as HTMLElement
            let valueInCell = +el.getAttribute("value")
            if(valueInCell>= (config.range/100 *firCoor + config.origin) && valueInCell<=(config.range/100 *secCoor + config.origin) ){
                elem.classList.add("range-slider__cell_status_active")
            }
            else{
                elem.classList.remove("range-slider__cell_status_active")
            } 
        })
    }
}


