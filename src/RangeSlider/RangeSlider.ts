import "./RangeSlider.scss"
import jQuery from "jquery";

export default (function($){
    $.fn.RangeSlider = function(options:object) {
        let sliderObjects: Array<Object> = []
        this.each((i:number, e:HTMLElement)=> {
            sliderObjects.push( CreateSlider(e,options) )
        })
        if(sliderObjects.length == 1) return sliderObjects[0]
        else return sliderObjects
    }
})(jQuery)

function CreateSlider(e: HTMLElement, options:object){  
    const root = e
    let sliderObject: RangeSliderObject;
    sliderObject = { 
        Model: new Model(options),
        Presenter: new Presenter(options),
        View: new View(root, options),

        init: function(){
            this.View.callback = this.Presenter.shiftReact.bind(this.Presenter)
            this.Presenter.callback_shiftReact = this.Model.update.bind(this.Model)
            this.Model.callback = this.Presenter.updateReact.bind(this.Presenter)
            this.Presenter.callback_updateReact = this.View.viewUpdate.bind(this.View)

            this.View.render()  
            this.Presenter.shiftReact({})
        },
        getValue(){
            return this.Model.value
        },
        setValue(start:number, end:number){
            this.Presenter.shiftReact({startPos: start, endPos: end, method: "direct"})    
        },
    }
    return sliderObject 
}
class Model implements ModelI{
    private _start: number;
    private _end: number;
    range: number;
    origin: number;
    step:number;
    value: Array<number>;
    type: string;
    set start(num:number){
        this.type == "range" ? 
            this._start = Math.min(Math.max(Math.ceil(this.end/this.step)*this.step - this.step, 0), Math.max(num, 0) )
            :
            this._start = 0 
    }
    get start(){
        return this._start
    }
    set end(num:number){
        this.type == "range" ? 
        this._end = Math.max(Math.min(Math.floor(this.start/this.step)*this.step + this.step, this.range), Math.min(num, this.range) )
        :
        this._end = Math.max(this.start, Math.min(num, this.range) )
    }
    get end(){
        return this._end
    }
    callback: Function;
    constructor({type="range", origin = 0, range = 100,  start = 0, end=<number>null, step=1, list=<Array <number|string>>[]}){
        this.type = type
        this.range = range
        this.origin = origin
        this.step = step
        if(list[0]){
            this.range = list.length - 1
            this.origin = 0
            this.step = 1
        }
        this._start = Math.max(Math.min(start - origin, this.range - this.step), 0) 
        this._end = end === null ? range : Math.min(range, Math.max(this.type == "point" ? this.start : this.start+this.step, end-origin) ) 
        this.value = [this.start + this.origin, this.end + this.origin]
    }
    update(data: {startPos: number, endPos: number, method: string}):void{
        if(data.method == "direct"){
            if(this.type == "point") {
                if(data.startPos<this.origin) this._end = 0
                else if(data.startPos> this.range + this.origin) this._end = this.range
                else if(data.startPos || data.startPos == 0)this._end = data.startPos - this.origin  
            }
            else{
                if(data.startPos<this.origin) this._start = 0
                else if(data.startPos>=this.range+this.origin) this._start =  this.range - 1
                else if(data.startPos || data.startPos == 0) this._start = data.startPos - this.origin
                   
                if(data.endPos<=this.start+this.origin) this._end = this.start + 1
                else if(data.endPos>=this.range+this.origin) this._end = this.range
                else if(data.endPos || data.endPos == 0) this._end = data.endPos - this.origin
            }
        }
        else if(data.method == "tepping"){
            if(data.startPos){
                this.start += this.step*data.startPos
            }
            if(data.endPos){
                this.end += this.step*data.endPos
            }
        }
        else if(data.method == "scaleClick"){
            if(this.type == "point" || Math.abs(data.startPos - this.end)<=Math.abs(data.startPos - this.start) ){
                this.end = data.startPos
            }
            else this.start = data.startPos
        }
        else{
            let newStart = this.range/100*data.startPos 
            let newEnd = this.range/100*data.endPos

            if((newEnd - this.end) >= this.step*0.7 || (this.end - newEnd) >= this.step*0.7 || newEnd>=this.range){
                newEnd = Math.round(newEnd/this.step)*this.step
            }
            else newEnd =this.end

            if((newStart - this.start) >= this.step*0.7 || (this.start - newStart) >= this.step*0.7 || newStart<=0){
                newStart = Math.round(newStart/this.step)*this.step
            }
            else newStart = this.start

            this.end = newEnd
            this.start = newStart
            //Это канитель со значениями new добавил уже для панели, чтобы на лету параметры слайдер удобно менять.
        }
        this.value = [this.start + this.origin, this.end + this.origin]
        
        this.callback(100/this.range*this.start, 100/this.range*this.end)
    }
}

class Presenter{
    callback_shiftReact: Function;
    callback_updateReact: Function;
    OptionalCallback_shiftReact: Function;
    OptionalCallback_updateReact: Function;
    constructor(data:object){ 

    }
    shiftReact(data: {endPos: number, startPos: number, method: string}){            
        this.callback_shiftReact(data)
        if(this.OptionalCallback_shiftReact) this.OptionalCallback_shiftReact()
    }
    updateReact(firCoor:number, secCoor:number){
        this.callback_updateReact(firCoor, secCoor)
        if(this.OptionalCallback_updateReact) this.OptionalCallback_updateReact()
    }
}

class View{
    root:HTMLElement;
    element: HTMLElement;
    orient: string;

    tumblers:    {elements:HTMLDivElement[];orient: string; type: string; cloud:string; render: Function; update: Function};
    line:       {element: HTMLElement; orient: string; render: Function}
    selected:   {element: HTMLElement; orient: string; render: Function; update: Function}
    scale:      {element: HTMLElement; display:boolean; list: Array<any>; orient: string; origin: number; range: number; 
                 interval: number; render: Function; update: Function }
    callback: Function;

    constructor(root: HTMLElement, {orient = "horizontal",type= "range", origin = 0, range = 100, scale=true, cloud="click", scaleInterval=10, list=[]}){
        this.root = root
        this.element
        this.orient = orient

        this.tumblers = new Tumblers({orient: orient, type: type, cloud: cloud})
        this.line = new Line({orient: orient})
        this.selected = new Selected({orient: orient})
        this.scale = new Scale({list: list, display: scale, orient: orient, origin: origin, range: range, interval: scaleInterval})
    }
    render():void{

        this.element = document.createElement("div")
        this.element.classList.add("RangeSlider")
        this.element.classList.add(`RangeSlider_for_${this.orient}`)
        this.root.innerHTML = ""
        this.root.append(this.element)
       
        this.element.append( this.line.render() )
        this.element.append( this.scale.render(this.callback) )
        this.tumblers.render(this.root, this.callback).forEach((el:HTMLElement)=>{
            this.line.element.append(el)
        })
        this.line.element.append(this.selected.render())
    }
    viewUpdate(firPos:number, secPos:number){
        let firValue = (this.scale.range/100*firPos+ this.scale.origin).toFixed()
        let secValue = (this.scale.range/100*secPos+ this.scale.origin).toFixed()
        if(this.scale.list[0]){
            firValue  = this.scale.list[+firValue]
            secValue = this.scale.list[+secValue]
        }
        this.tumblers.update(firPos, secPos, firValue, secValue)

        this.selected.update(firPos, secPos)

        this.scale.update(firPos, secPos)
    }
}

class Line{
    element: HTMLElement;
    orient: string;
    constructor(data: {orient: string}){
        this.orient = data.orient
    }
    render(){
        this.element = document.createElement("div")
        this.element.classList.add("RangeSlider__line")
        this.element.classList.add(`RangeSlider__line_for_${this.orient}`)
        return this.element
    }
}
class Selected{
    element: HTMLElement;
    orient: string;

    constructor(data: {orient: string}){
        this.orient = data.orient 
    }
    render(){
        this.element = document.createElement("div")
        this.element.classList.add("RangeSlider__selected")
        this.element.classList.add(`RangeSlider__selected_for_${this.orient}`)
        return this.element
    }
    update(firPos: number, secPos: number){
        if(this.orient == "vertical"){
            this.element.style.bottom = firPos + "%"
            this.element.style.top = 100 - secPos + "%"
            
        }
        else{
            this.element.style.left = firPos + "%"
            this.element.style.right = 100 - secPos + "%"
        }
    }
}

class Tumblers{
    elements: HTMLDivElement[]
    orient: string;
    type: string;
    cloud: string;
    constructor(data: {orient:string, type:string, cloud: string;}){
        this.orient = data.orient
        this.type = data.type
        this.cloud = data.cloud
    }
    render(root: HTMLElement, callback:Function){
        let list = []
        for(let i=0; i<2; i++){ 
            let elem = document.createElement("div")
            let cloud: HTMLElement
            elem.classList.add("RangeSlider__tumbler")
            elem.classList.add(`RangeSlider__tumbler_for_${this.orient}`)
            if(this.type === "point" && i===0) elem.style.display = "none"

            cloud = document.createElement("div")
            cloud.classList.add("RangeSlider__cloud")
            cloud.classList.add(`RangeSlider__cloud_for_${this.orient}`)
            cloud.append(document.createElement("b"))
            cloud.append(document.createElement("div"))

            elem.append(cloud)

            if(this.cloud !== "always") cloud.style.display = "none"
            
            elem.onmousedown = (e: MouseEvent)=>{
                e.preventDefault()
                if(this.cloud == "click") cloud.style.display = "block"
                root.onmousemove = (ev:MouseEvent)=>{
                    let line= root.querySelector(".RangeSlider")
                    let bias = this.orient === "vertical" ? 
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
                    if(this.cloud == "click") cloud.style.display = "none"
                    root.onmousemove = null;
                    document.onmouseup = null;
                }
            }
            elem.onfocus = (ev:Event)=>{
                if(this.cloud == "click") cloud.style.display = "block"
                let target = (<HTMLElement>ev.target)
                document.onkeydown = e=>{
                    if( (e.key === "ArrowDown" && this.orient ==="vertical") || (e.key === "ArrowLeft" && this.orient !=="vertical")){
                        target.nextSibling ? 
                                callback({startPos: -1, method: "tepping"})
                                :
                                callback({endPos:-1, method:"tepping"})
                    } 
                    else if( (e.key === "ArrowUp" && this.orient ==="vertical") || (e.key === "ArrowRight" && this.orient !=="vertical")){
                        target.nextSibling ? 
                                callback({startPos: 1, method: "tepping"})
                                :
                                callback({endPos:1, method:"tepping"})
                    }
                }
                (<HTMLElement>ev.target).onblur = e=>{
                    if(this.cloud == "click") cloud.style.display = "none"
                    document.onkeydown = null;
                    (<HTMLElement>e.target).onblur = null
                }
            }
            list.push(elem)
        };
        this.elements = list
        return this.elements
    }
    update(firPos: number, secPos:number, valueFir: string, valueSec: string){
        let firEl = this.elements[0] as HTMLElement
        let secEl = this.elements[1] as HTMLElement
        if(this.orient == "vertical"){
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
    display: boolean;
    list: Array<any>
    orient: string;
    origin: number; 
    range: number; 
    interval: number;

    constructor(data:{list: Array<any>;orient: string; origin: number; range: number; interval: number; display: boolean;}){
        this.display = data.display
        this.orient = data.orient
        this.origin = data.origin 
        this.range = data.range 
        this.interval = data.interval
        this.list = data.list
        if(this.list[0]){
            this.origin = 0;
            this.range =this.list.length -1
            this.interval = 1
        }
    }
    render(callback:Function){
        let thisList = Boolean(this.list[0])
        this.element =  document.createElement("div")
        this.element.classList.add("RangeSlider__scale")
        this.element.classList.add(`RangeSlider__scale_for_${this.orient}`)

        let intervals = Math.ceil(this.range/ this.interval)
        
        let flexcont = document.createElement("div")
        flexcont.classList.add("Scale__mainline")
        flexcont.classList.add(`Scale__mainline_for_${this.orient}`)

        this.element.append(flexcont)
        
        let cell = document.createElement("span")
        cell.classList.add("Scale__cell")
        cell.classList.add(`Scale__cell_for_${this.orient}`)
        if(this.orient == "vertical"){
            cell.style.height = this.interval/this.range*100 + "%"
            
        }
        else{
            cell.style.width = this.interval/this.range*100 + "%"
        }
        
        let createCell = (int:number)=>{
            let currentCell = (cell.cloneNode(true) as HTMLSpanElement)
           
            currentCell.classList.add(`Scale__cell_meaning_${int}`)
            currentCell.setAttribute("value", `${int}`)
            
            let amountCont = document.createElement("span")
            amountCont.innerHTML = thisList ?
                this.list[int]
                :
                int.toString()
            currentCell.append(amountCont)
            
            flexcont.append(currentCell)

            return currentCell
        }
        createCell(this.origin)
        for( let i=1; i<intervals; i++){
            if(i !==intervals-1) {
                createCell(i*this.interval+this.origin)
            }
            else createCell(i*this.interval+this.origin).style.flexShrink = "1"
        }
        this.orient == "vertical" ? 
            createCell(this.range+this.origin).style.height = "0px"
            :
            createCell(this.range+this.origin).style.width = "0px"
        
        this.element.onclick= (e:MouseEvent)=>{
            if( (<HTMLElement>e.target).closest(".Scale__cell>span") ){
                let value = +(<HTMLElement>e.target).closest(".Scale__cell").getAttribute("value") - this.origin
                callback({startPos: value, method: "scaleClick"})
            }
        }
        if(!this.display) this.element.style.display = "none"
        
        return this.element
    }
    update(firPos: number, secPos:number){
        this.element.querySelectorAll(".Scale__cell").forEach(el=>{
            let elem = el as HTMLElement
            let amount = +el.getAttribute("value")
            if(amount>= (this.range/100 *firPos + this.origin) && amount<=(this.range/100 *secPos + this.origin) ){
                elem.classList.add("Scale__cell_status_active")
            }
            else{
                elem.classList.remove("Scale__cell_status_active")
            } 
        })
    }
}


