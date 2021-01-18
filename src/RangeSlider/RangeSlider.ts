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
    View: View;
    Presenter: Presenter;
    Model: Model;
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
            scaleInterval: verifiedInterval,
            cloud: cloud,
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
        this.View = new View(this.root, this.config);
        this.Presenter = new Presenter(this.config);
        this.Model = new Model(this.config)
    };
    init(){
        this.View.callback = this.Presenter.shiftReact.bind(this.Presenter)
        this.Presenter.callback_shiftReact = this.Model.updateConfig.bind(this.Model)
        this.Model.callback = this.Presenter.updateReact.bind(this.Presenter)
        this.Presenter.callback_updateReact = this.View.updateView.bind(this.View)

        this.View.render()  
        this.Presenter.shiftReact({startPos:undefined, endPos:undefined, method:"standart"})
    };
    getValue(){
        return this.config.value
    };
    setValue(start:number, end:number){
        this.Presenter.shiftReact({startPos: start, endPos: end, method: "direct"})    
    }
}

class Model{
    config: sliderConfigI;
    callback: Function;

    constructor(option:sliderConfigI){
        this.config = option
    }
    updateConfig(data: {startPos: number, endPos: number, method: string}):void{
        let config = this.config;
        let{type, origin, range, step} = config;
        
        if(data.method == "direct"){
            if(type == "point") {
                if(data.startPos< origin) this.config._end = 0
                else if(data.startPos> range + origin) this.config._end = range
                else if(data.startPos || data.startPos == 0)this.config._end = data.startPos - origin  
            }
            else{
                let newStart = data.startPos - origin || config.start
                let newEnd = (data.endPos || data.endPos == 0) ? data.endPos - origin : config.end
                if(newStart>=newEnd) return
                newStart = Math.min( Math.max(newStart, 0), range-1 )
                newEnd = Math.min(Math.max(newEnd, 1), range)

                config._start = newStart
                config._end = newEnd
                // Не знаю, стоило ли к приватным методам обращаться, но ситуация с этим способом 
                //ввода такова, что что-то иное придумать сложно
            }
        }
        else if(data.method == "tepping"){
            if(data.startPos){
                config.start += step*data.startPos
            }
            if(data.endPos){
                config.end += step*data.endPos
            }
        }
        else if(data.method == "scaleClick"){
            if(type == "point" || Math.abs(data.startPos - config.end)<=Math.abs(data.startPos - config.start) ){
                config.end = data.startPos
            }
            else config.start = data.startPos
        }
        else{
            let newStart = range/100*data.startPos 
            let newEnd = range/100*data.endPos

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
        config.value = [config.start + origin, config.end + origin]
        this.callback(100/range*config.start, 100/range*config.end)
    }
}

class Presenter{
    callback_shiftReact: Function;
    callback_updateReact: Function;
    OptionalCallback_shiftReact: Function;
    OptionalCallback_updateReact: Function;
    constructor(data:object){ 
        
    }
    shiftReact(data: {startPos: number, endPos: number,  method: string}){            
        this.callback_shiftReact(data)
        if(this.OptionalCallback_shiftReact) this.OptionalCallback_shiftReact(data)
    }
    updateReact(firCoor:number, secCoor:number){
        this.callback_updateReact(firCoor, secCoor)
        if(this.OptionalCallback_updateReact) this.OptionalCallback_updateReact(firCoor, secCoor)
    }
}

class View{
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
        mainElement.classList.add("RangeSlider")
        mainElement.classList.add(`RangeSlider_for_${config.orient}`)
        this.root.innerHTML = ""
        this.root.append(mainElement)
       
        mainElement.append( this.line.render() )
        mainElement.append( this.scale.render(this.callback) )
        this.tumblers.render(this.callback).forEach((el:HTMLElement)=>{
            this.line.element.append(el)
        })
        this.line.element.append(this.selected.render())
    }
    updateView(firPos:number, secPos:number){
        let config = this.config
        
        let firValue: string
        let secValue: string
        firValue = (config.start+config.origin).toString()
        secValue = (config.end+config.origin).toString()

        if(config.list.length){
            firValue  = config.list[+firValue].toString()
            secValue = config.list[+secValue].toString()
        }
        this.tumblers.update(firPos, secPos, firValue, secValue)

        this.selected.update(firPos, secPos)

        this.scale.update(firPos, secPos)
    }
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
        lineElement.classList.add("RangeSlider__line")
        lineElement.classList.add(`RangeSlider__line_for_${config.orient}`)

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
        selectedElement.classList.add("RangeSlider__selected")
        selectedElement.classList.add(`RangeSlider__selected_for_${config.orient}`)

        this.element = selectedElement 
        return selectedElement
    }
    update(firPos: number, secPos: number){
        let config = this.config;
        let selectedElement = this.element

        if(config.orient == "vertical"){
            selectedElement.style.bottom = firPos + "%"
            selectedElement.style.top = 100 - secPos + "%"
            
        }
        else{
            selectedElement.style.left = firPos + "%"
            selectedElement.style.right = 100 - secPos + "%"
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

        let list = []
        for(let i=0; i<2; i++){ 
            let tumblerElement = document.createElement("div")
            let cloud: HTMLElement
            tumblerElement.classList.add("RangeSlider__tumbler")
            tumblerElement.classList.add(`RangeSlider__tumbler_for_${config.orient}`)
            if(config.type === "point" && i===0) tumblerElement.style.display = "none"

            cloud = document.createElement("div")
            cloud.classList.add("RangeSlider__cloud")
            cloud.classList.add(`RangeSlider__cloud_for_${config.orient}`)
            cloud.append(document.createElement("b"))
            cloud.append(document.createElement("div"))

            tumblerElement.append(cloud)

            if(config.cloud !== "always") cloud.style.display = "none"
            
            tumblerElement.onmousedown = (e: MouseEvent)=>{
                e.preventDefault()
                if(config.cloud == "click") cloud.style.display = "block"
                root.onmousemove = (ev:MouseEvent)=>{
                    let line= root.querySelector(".RangeSlider")
                    let bias = config.orient === "vertical" ? 
                                -(ev.clientY - line.getBoundingClientRect().bottom)/line.getBoundingClientRect().height * 100
                                //Минус тут нужен для реверса. так как шкала сверху вниз т.е. противонаправлена линии координат
                                :
                                (ev.clientX - line.getBoundingClientRect().x)/line.getBoundingClientRect().width * 100 
                    if (!i){
                        callback({startPos: bias})
                    }
                    else(callback({endPos: bias }) )
                }
                document.onmouseup = e=>{
                    if(config.cloud == "click") cloud.style.display = "none"
                    root.onmousemove = null;
                    document.onmouseup = null;
                }
            }
            tumblerElement.onfocus = (ev:Event)=>{
                if(config.cloud == "click") cloud.style.display = "block"
                let target = (<HTMLElement>ev.target)
                document.onkeydown = e=>{
                    if( (e.key === "ArrowDown" && config.orient ==="vertical") || (e.key === "ArrowLeft" && config.orient !=="vertical")){
                        target.nextSibling ? 
                                callback({startPos: -1, method: "tepping"})
                                :
                                callback({endPos:-1, method:"tepping"})
                    } 
                    else if( (e.key === "ArrowUp" && config.orient ==="vertical") || (e.key === "ArrowRight" && config.orient !=="vertical")){
                        target.nextSibling ? 
                                callback({startPos: 1, method: "tepping"})
                                :
                                callback({endPos:1, method:"tepping"})
                    }
                }
                (<HTMLElement>ev.target).onblur = e=>{
                    if(config.cloud == "click") cloud.style.display = "none"
                    document.onkeydown = null;
                    (<HTMLElement>e.target).onblur = null
                }
            }
            list.push(tumblerElement)
        };
        this.elements = list
        return list
    }
    update(firPos: number, secPos:number, valueFir: string, valueSec: string){
        let config = this.config
        let tumblerElements = this.elements

        let firEl = tumblerElements[0] as HTMLElement
        let secEl = tumblerElements[1] as HTMLElement
        if(config.orient == "vertical"){
            firEl.style.bottom = firPos + "%";
            secEl.style.bottom = secPos  + "%"
        }
        else{
            firEl.style.left = firPos + "%";
            secEl.style.left = secPos  + "%"
        }
    
        firEl.querySelector("b").innerText = valueFir;
        secEl.querySelector("b").innerText = valueSec;
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
        let scaleElement

        let thisList = Boolean(config.list.length)
        scaleElement =  document.createElement("div")
        scaleElement.classList.add("RangeSlider__scale")
        scaleElement.classList.add(`RangeSlider__scale_for_${config.orient}`)

        let intervals = Math.ceil(config.range/ config.scaleInterval)
        
        let flexcont = document.createElement("div")
        flexcont.classList.add("Scale__mainline")
        flexcont.classList.add(`Scale__mainline_for_${config.orient}`)

        scaleElement.append(flexcont)
        
        let cell = document.createElement("span")
        cell.classList.add("Scale__cell")
        cell.classList.add(`Scale__cell_for_${config.orient}`)
        if(config.orient == "vertical"){
            cell.style.height = config.scaleInterval/config.range*100 + "%"
            
        }
        else{
            cell.style.width = config.scaleInterval/config.range*100 + "%"
        }
        
        let createCell = (int:number)=>{
            let currentCell = (cell.cloneNode(true) as HTMLSpanElement)
           
            currentCell.classList.add(`Scale__cell_meaning_${int}`)
            currentCell.setAttribute("value", `${int}`)
            
            let amountCont = document.createElement("span")
            amountCont.innerHTML = thisList ?
                config.list[int].toString()
                :
                int.toString()
            currentCell.append(amountCont)
            
            flexcont.append(currentCell)

            return currentCell
        }
        createCell(config.origin)
        for( let i=1; i<intervals; i++){
            if(i !==intervals-1) {
                createCell(i*config.scaleInterval+config.origin)
            }
            else createCell(i*config.scaleInterval+config.origin).style.flexShrink = "1"
        }
        config.orient == "vertical" ? 
            createCell(config.range+config.origin).style.height = "0px"
            :
            createCell(config.range+config.origin).style.width = "0px"
        
        scaleElement.onclick= (e:MouseEvent)=>{
            if( (<HTMLElement>e.target).closest(".Scale__cell>span") ){
                let value = +(<HTMLElement>e.target).closest(".Scale__cell").getAttribute("value") - config.origin
                callback({startPos: value, method: "scaleClick"})
            }
        }
        if(!config.scale) scaleElement.style.display = "none"
        
        this.element = scaleElement
        return scaleElement
    }
    update(firPos: number, secPos:number){
        let config = this.config
        let scaleElement = this.element

        scaleElement.querySelectorAll(".Scale__cell").forEach(el=>{
            let elem = el as HTMLElement
            let amount = +el.getAttribute("value")
            if(amount>= (config.range/100 *firPos + config.origin) && amount<=(config.range/100 *secPos + config.origin) ){
                elem.classList.add("Scale__cell_status_active")
            }
            else{
                elem.classList.remove("Scale__cell_status_active")
            } 
        })
    }
}


