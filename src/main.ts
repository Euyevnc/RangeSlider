import "./main.scss"
import jQuery from "jquery";


export default (function($){
    $.fn.RangeSlider = function(options:object) {
        let sliderObjects: Array<Object> = []
        this.each((i:number,e:HTMLElement)=> {
            sliderObjects.push( CreateSlider(e,options) )
        })
        if(sliderObjects.length == 1) return sliderObjects[0]
        else return sliderObjects
    }
})(jQuery)

function CreateSlider(e: HTMLElement, options:object){  
    const root = e
    const ModelClass = class{
        private _start: number;
        private _end: number;
        range: number;
        origin: number;
        step:number;
        value: Array<number>;
        type: string;
        set start(num:number){
            this.type == "range" ? 
                this._start = Math.min(this.end-this.step, Math.max(num, 0) )
                :
                this._start = Math.min(this.end, Math.max(num, 0) )
        }
        get start(){
            return this._start
        }
        set end(num:number){
            this.type == "range" ? 
            this._end = Math.max(this.start+this.step, Math.min(num, this.range) )
            :
            this._end = Math.max(this.start, Math.min(num, this.range) )
        }
        get end(){
            return this._end
        }
        updated: Function;
        constructor({type="range", origin = 0, range = 100,  start = 0, end=null, step=1, list=[]}){
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
            this._end = end === null ? range : Math.min(range, Math.max(this.start+1, end-origin) ) 
            this.value = [this.start + this.origin, this.end + this.origin]
        }
        update(data: {startPos: number, endPos: number, method: string}):void{
            if(data.method == "direct"){
                if(this.type == "point") {
                    if(data.startPos<this.origin) this._end = 0
                    else if(data.startPos> this.range + this.origin) this._end = this.range
                    else(this._end = data.startPos - this.origin)     
                }
                else{
                    if(data.startPos<this.origin) this._start = 0
                    if(data.startPos>=this.range+this.origin) this._start =  this.range - this.step
                    if(data.startPos>=data.endPos) this._start = data.endPos - this.origin - this.step
                    
                    if(data.endPos>=this.range+this.origin) this._end = this.range
                    if(data.endPos<=this.origin) this._end = 0 + this.step
                    if(data.endPos<=data.startPos) this._end = data.startPos + this.step
                    
                }
            }
            else if(data.method == "tepping"){
                if(data.startPos){
                    this.start += data.startPos*this.step
                }
                if(data.endPos){
                    this.end += data.endPos*this.step
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
                if((newEnd - this.end) >= this.step*0.7 || (this.end - newEnd) >= this.step*0.7 || newEnd==this.range){
                    this.end = Math.round(newEnd/this.step)*this.step
                }
                if((newStart - this.start) >= this.step*0.7 || (this.start - newStart) >= this.step*0.7 || newStart==0){
                    this.start = Math.round(newStart/this.step)*this.step
                }
            }
            
            if(this.type == "range")  this.value = [this.start + this.origin, this.end + this.origin]
            else{
                this.start = 0
                this.value = [this.end + this.origin]
            }

            this.updated(100/this.range*this.start, 100/this.range*this.end)
        }
    }
    const PresenterClass = class{
        callToModel: Function;
        callToView: Function;

        constructor(data:object){ 

        }
        shiftReact(data: {endPos: number, startPos: number, method: string}){            
            this.callToModel(data)
        }
        updateReact(firCoor:number, secCoor:number){
            this.callToView(firCoor, secCoor)
        }
    }
    const ViewClass = class{
        element: HTMLElement;
        orient: string;
        type: string;
        scaleDisplay: boolean;
        origin: number;
        size: number;
        range: number;
        start:number;
        end: number;

        tumbler:    {html: string; elements:NodeListOf<Element>;orient: string; type: string; cloud:string; render: Function; update: Function};
        line:       {element: HTMLElement; orient: string; render: Function}
        selected:   {html: string; element: HTMLElement; orient: string; render: Function; update: Function}
        scale:      {html: string; element: HTMLElement; list: Array<any>; orient: string; origin: number; range: number; 
                     interval: number; render: Function; update: Function }

        tumblerShifted: Function;

        static scaleClass = class{
            html: string;
            element: HTMLElement; 
            list: Array<any>
            orient: string;
            origin: number; 
            range: number; 
            interval: number;

            constructor(data:{list: Array<any>;orient: string; origin: number; range: number; interval: number;}){
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
                this.html = `<div class='RangeSlider__scale RangeSlider__scale_for_${this.orient}'></div>`;
            }
            render(callback:Function){
                let thisList = Boolean(this.list[0])
                let container = this.element =  root.querySelector(".RangeSlider__scale")
                let intervals = Math.ceil(this.range/ this.interval)
                
                let flexcont = document.createElement("div")
                flexcont.classList.add("Scale__mainline")
                flexcont.classList.add(`Scale__mainline_for_${this.orient}`)

                container.append(flexcont)
                
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
        static LineClass = class{
            element: HTMLElement;
            orient: string;
            constructor(data: {orient: string}){
                this.orient = data.orient
            }
            render(){
                this.element = root.querySelector(".RangeSlider__line") as HTMLElement
            }
        }
        static TumblerClass = class{
            html: string;
            elements: NodeListOf<HTMLElement>
            orient: string;
            type: string;
            size: number;
            cloud: string;
            constructor(data: {orient:string, type:string, cloud: string;}){
                this.orient = data.orient
                this.type = data.type
                this.cloud = data.cloud
                this.html = `<span tabindex= "1"; class='RangeSlider__tumbler RangeSlider__tumbler_for_${this.orient}'> </span>`
            }
            render(callback:Function){
                this.elements = root.querySelectorAll(".RangeSlider__tumbler") 
                this.elements.forEach((el, i)=>{ 
                    let elem = (el as HTMLElement)
                    let cloud: HTMLElement
                    if(this.type === "point" && i===0) elem.style.display = "none"
                    
                    cloud = document.createElement("div")
                    cloud.classList.add("RangeSlider__cloud")
                    cloud.classList.add(`RangeSlider__cloud_for_${this.orient}`)
                    cloud.append(document.createElement("b"))
                    cloud.append(document.createElement("div"))
                    el.append(cloud)

                    if(this.cloud !== "always") cloud.style.display = "none"
                    
                    elem.onmousedown = (e: MouseEvent)=>{
                        e.preventDefault()
                        if(this.cloud == "click") cloud.style.display = "block"
                        root.onmousemove = (ev:MouseEvent)=>{
                            let tumbler = <HTMLElement>e.target;
                            let line= root.querySelector(".RangeSlider")
                            let bias = this.orient === "vertical" ? 
                                        -(ev.clientY - line.getBoundingClientRect().bottom)/line.getBoundingClientRect().height * 100
                                        //Минус тут нужен для реверса. так как шкала сверху вниз т.е. противонаправлена линии координат
                                        :
                                        (ev.clientX - line.getBoundingClientRect().x)/line.getBoundingClientRect().width * 100 
                            if (tumbler.nextSibling){
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
                    elem.onfocus = (e: MouseEvent)=>{
                        if(this.cloud == "click") cloud.style.display = "block"
                        let target = (<HTMLElement>e.target)
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
                        (<HTMLElement>e.target).onblur = e=>{
                            if(this.cloud == "click") cloud.style.display = "none"
                            document.onkeydown = null;
                            (<HTMLElement>e.target).onblur = null
                        }
                    }
                } );
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
        static SelectedClass = class{
            element: HTMLElement;
            html: string;
            orient: string;

            constructor(data: {orient: string}){
                this.orient = data.orient 
                this.html = `<div class='RangeSlider__selected RangeSlider__selected_for_${this.orient}'></div>`
            }
            render(){
                this.element = root.querySelector(".RangeSlider__selected")
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
        constructor({orient = "horizontal",type= "range", origin = 0, range = 100, scale=true, cloud="click", scaleInterval=10, list=[]}){
            this.element
            this.orient = orient
            this.scaleDisplay = scale

            this.tumbler = new ViewClass.TumblerClass({orient: orient, type: type, cloud: cloud})

            this.line = new ViewClass.LineClass({orient: orient})

            this.selected = new ViewClass.SelectedClass({orient: orient})
        
            this.scale = new ViewClass.scaleClass({list: list, orient: orient, origin: origin, range: range, interval: scaleInterval})
        }
        render():void{
            root.innerHTML =  `<div class='RangeSlider RangeSlider_for_${this.orient}'><div class='RangeSlider__line RangeSlider__line_for_${this.orient}'> ${this.selected.html}${this.tumbler.html}${this.tumbler.html}</div> ${this.scale.html} </div></div>`;
            this.line.render()

            this.scale.render(this.tumblerShifted)
            if(!this.scaleDisplay) this.scale.element.style.display = "none"

            this.tumbler.render(this.tumblerShifted)

            this.selected.render()

            this.element = root.querySelector(".RangeSlider")
        }
        viewUpdate(firPos:number, secPos:number){
            let firValue = (this.scale.range/100*firPos+ this.scale.origin).toFixed()
            let secValue = (this.scale.range/100*secPos+ this.scale.origin).toFixed()
            if(this.scale.list[0]){
                firValue  = this.scale.list[+firValue]
                secValue = this.scale.list[+secValue]
            }
            this.tumbler.update(firPos, secPos, firValue, secValue)

            this.selected.update(firPos, secPos)

            this.scale.update(firPos, secPos)
        }
    }
    const sliderObject = { 
        Model: new ModelClass(options),
        Presenter: new PresenterClass(options),
        View: new ViewClass(options),

        init: function(){
            this.View.tumblerShifted = this.Presenter.shiftReact.bind(this.Presenter)
            this.Presenter.callToModel = this.Model.update.bind(this.Model)
            this.Model.updated = this.Presenter.updateReact.bind(this.Presenter)
            this.Presenter.callToView = this.View.viewUpdate.bind(this.View)

            this.View.render()  
            this.Presenter.shiftReact({})
        },
        getValue(){
            console.log(`Selected range: ${this.Model.value[0]} — ${this.Model.value[1]}`)
            return this.Model.value
        },
        setValue(start:number, end:number){
            this.Presenter.shiftReact({startPos: start, endPos: end, method: "direct"})
            
        },
    }
    return sliderObject 
}

// let slider = jQuery(".wrapper>div").RangeSlider({type: "range",start:20, end : 80, step: 1, scale:false, cloud: "always"}  )
// let slider2 = jQuery(".wrapper-two>div").RangeSlider({type: "point", origin: 10, range: 90, end:10, step: 5, scaleInterval: 20})
// let slider3 = jQuery(".wrapper-three>div").RangeSlider({type: "point", orient:"vertical", origin: 0, scaleInterval: 5, range: 10, end:5} )
// let slider4 = jQuery(".wrapper-list>div").RangeSlider( {type: "range", list: ["ἄ", "β", "γ", "λ", "Ξ", "ζ", "π", "θ", "ψ"], end: 2, cloud:"none"})

// slider.init()
// slider2.init()
// slider3.init()
// slider4.init()




