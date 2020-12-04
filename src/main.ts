import "./main.scss"

function CreateSlider(options:object){  
    const root = this as HTMLElement
    const clModel = class{
        private _start: number;
        private _end: number;
        range: number;
        origin: number;
        step:number;
        value: Array<number>;
        set start(num:number){
            this._start = Math.min(this.end, Math.max(num, 0) )
        }
        get start(){
            return this._start
        }
        set end(num:number){
            this._end = Math.max(this.start, Math.min(num, this.range) )
        }
        get end(){
            return this._end
        }

        updated: Function;
        constructor({ origin = 0, range = 100,  start = 0, end=null, step=1, list=[null]}){
            this.range = range
            this.origin = origin
            this.step = step
            if(list[0]!==null){
                this.range = list.length - 1
                this.origin = 0
                this.step = 1
            }
            this._start = Math.max(start - origin, 0) 
            this._end = end === null ? range : Math.min(range, Math.max(this.start, end-origin) ) 
            this.value = [this.start + this.origin, this.end + this.origin]
        }
        update(data: {startPos: number, endPos: number, method: string, point:boolean}):void{
            if(data.method == "direct"){
                if(data.endPos) this.end = data.endPos - this.origin
                if(data.startPos) this.start = data.startPos - this.origin
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
                if(data.point || Math.abs(data.startPos - this.end)<=Math.abs(data.startPos - this.start) ){
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
            if (data.point){this.start = 0}
            this.value = [this.start + this.origin, this.end + this.origin]

            this.updated(100/this.range*this.start, 100/this.range*this.end)
        }
    }


    const ClPresenter = class{
        inversion: boolean;
        type: string;

        callToModel: Function;
        callToView: Function;

        constructor({orient = "horizontal", type="range"}){ 
            this.type = type
            if(orient === "vertical") this.inversion = true
            else this.inversion = false
        }
        shiftReac(data: {endPos: number, startPos: number, point:boolean, method: string}){
            if(this.type=="point"){data.point=true}
            if(this.inversion && !data.method){
                if(data.endPos)data.endPos = 100 - data.endPos
                if(data.startPos)data.startPos = 100 - data.startPos 
            }
            
            this.callToModel(data)
        }
        updateReact(firCoor:number, secCoor:number){
            this.callToView(firCoor, secCoor)

        }
    }

    const clView = class{
        element: HTMLElement;
        orient: string;
        type: string;
        meaning: boolean;
        origin: number;
        size: number;
        range: number;
        start:number;
        end: number;

        tumbler: {html: string; elements:NodeListOf<Element>;orient: string; type: string; size: string; color: string; roundness: string; borders: string; onclick: EventListener; onfocus: EventListener; render: Function};
        line: {element: HTMLElement;orient: string; weight: string; color: string; roundness: string; borders: string; render: Function}
        selected : {html: string; element: HTMLElement; orient: string; color: string; weight: string;roundness: string; render: Function}
        meanings : {element: HTMLElement; list: Array<any>; orient: string; origin: number; range: number; interval: number;length:string; fontSize:string; color:string; colorActive:string; scale: number; render: Function; update: Function }

        tumblerShifted: Function;


        meaningsClass = class{
            element: HTMLElement; 
            list: Array<any>
            orient: string;
            origin: number; 
            range: number; 
            interval: number;
            length: string;
            fontSize:string
            color:string
            colorActive:string
            scale: number

            constructor(data:{list: Array<any>;orient: string; origin: number; range: number; interval: number;length:string; fontSize:string; color: string; colorActive:string;scale: number; }){
                this.orient = data.orient
                this.origin = data.origin 
                this.range = data.range 
                this.interval = data.interval
                this.length = data.length
                this.fontSize = data.fontSize
                this.color = data.color
                this.colorActive = data.colorActive
                this.scale = data.scale || 1
                this.list = data.list
                if(this.list[0]){
                    this.origin = 0;
                    this.range =this.list.length -1
                    this.interval = 1
                }
                
            }
            render(callback:Function){
                let thisList = Boolean(this.list[0])
                let container = this.element =  root.querySelector(".RangeSlider__meanings")
                let intervals = Math.ceil(this.range/ this.interval)
                
                let flexcont = document.createElement("div")
                flexcont.classList.add("Meaninigs__mainline")

                container.append(flexcont)
                
                let cell = document.createElement("span")
                cell.classList.add("Meaninigs__cell")
                cell.style.color = this.color
                cell.style.fontSize = this.fontSize
                if(this.orient == "vertical"){
                    cell.style.height = this.interval/this.range*100 + "%"
                    cell.style.borderBottom = `1px solid ${this.color}`
                    cell.style.width = this.length;
                }
                else{
                    cell.style.width = this.interval/this.range*100 + "%"
                    cell.style.borderLeft = `1px solid ${this.color}`
                    cell.style.height = this.length;
                }
                
                let createCell = (int:number)=>{
                    let currentCell = (cell.cloneNode(true) as HTMLSpanElement)
                    currentCell.classList.add(`Meaninigs__cell_meaning_${int}`)
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
                    if( (<HTMLElement>e.target).closest(".Meaninigs__cell>span") ){
                        let value = +(<HTMLElement>e.target).closest(".Meaninigs__cell").getAttribute("value") - this.origin
                        callback({startPos: value, method: "scaleClick"})
                    }
                }
            }
            
            update(fir: number, sec:number){
                this.element.querySelectorAll(".Meaninigs__cell").forEach(el=>{
                  if(this.orient=="vertical"){ 
                        let elem = el as HTMLElement
                        let amount = +el.getAttribute("value")
                        if(amount>= (this.range/100 *fir + this.origin) && amount<=(this.range/100 *sec + this.origin) ){
                            elem.style.color = this.colorActive
                            elem.style.borderBottom = `1px solid ${this.colorActive}`
                            elem.style.fontSize = `calc( ${this.fontSize}*${this.scale} )`
                            elem.style.width = `calc( ${this.length}*${this.scale} )`
                            elem.classList.add("Meaninigs__cell_status_active")
                        }
                        else{
                            elem.style.color = this.color
                            elem.style.borderBottom = `1px solid ${this.color}`
                            elem.style.fontSize = this.fontSize
                            elem.style.width = this.length
                            elem.classList.remove("Meaninigs__cell_status_active")
                        }
                    }
                    else{
                        let elem = el as HTMLElement
                        let amount = +el.getAttribute("value")
                    
                        if( amount>= (this.range/100 *fir + this.origin) && amount<=(this.range/100 *sec + this.origin) ){
                            elem.style.color = this.colorActive
                            elem.style.borderLeft = `1px solid ${this.colorActive}`
                            elem.style.fontSize = `calc( ${this.fontSize}*${this.scale} )`
                            elem.style.height = `calc( ${this.length}*${this.scale} )`
                            elem.classList.add("Meaninigs__cell_status_active")
                        }
                        else{
                            elem.style.color = this.color
                            elem.style.borderLeft = `1px solid ${this.color}`
                            elem.style.fontSize = this.fontSize
                            elem.style.height = this.length
                            elem.classList.remove("Meaninigs__cell_status_active")
                        }
                        
                    }
                })
            }
        }

        LineClass = class{
            element: HTMLElement;
            orient: string;
            weight: string;
            color: string;
            roundness: string;
            borders: string;
            constructor(data: {orient: string, weight: string,color: string, roundness: string}){
                this.orient = data.orient
                this.weight = data.weight;
                this.color = data.color
                this.roundness = data.roundness
            }
            render(){
                let line = this.element = root.querySelector(".RangeSlider__line") as HTMLElement
                if(this.orient == "vertical") line.style.width = this.weight
                else line.style.height = this.weight
                line.style.background = this.color
                line.style.borderRadius = this.roundness
            }
        }
        TumblerClass = class{
            html: string;
            elements: NodeListOf<HTMLElement>
            orient: string;
            type: string;
            size: string;
            color: string;
            roundness: string;
            borders: string;

            onclick: EventListener;
            onfocus: EventListener;
           
            constructor(data: {orient:string, type:string, size:string, color:string, roundness:string, borders :string}){
                this.html = `<span tabindex= "1"; class='RangeSlider__tumbler'> </span>`
                this.orient = data.orient
                this.type = data.type
                this.size = data.size;
                this.color = data.color;
                this.roundness = data.roundness;

            }
            render(callback:Function){
                this.elements = root.querySelectorAll(".RangeSlider__tumbler") 
                this.elements.forEach((el, i)=>{ 
                    let elem = (el as HTMLElement)
                    elem.style.height = this.size 
                    elem.style.width = this.size 
                    elem.style.background = this.color
                    elem.style.borderRadius = this.roundness
                    elem.style. border = this.borders
                    elem.style.transform = this.orient == "vertical" ? "translateY(50%)" : "translateX(-50%)"
                    if(this.orient == "vertical") elem.style.marginLeft =  `calc( (-${this.size} + ${elem.parentElement.style.width}) /2)`
                    else elem.style.marginTop = `calc((-${this.size} + ${elem.parentElement.style.height})/2)`
                    if(this.type === "point" && i===0) elem.style.display = "none"
                    
                    elem.onmousedown = (e: MouseEvent)=>{
                        e.preventDefault()
                        root.onmousemove = ev=>{
                            let tumbler = <HTMLElement>e.target;
                            let line= root.querySelector(".RangeSlider")
                            let bias = this.orient === "vertical" ? 
                                        (ev.clientY - line.getBoundingClientRect().y)/line.getBoundingClientRect().height * 100
                                        :
                                        (ev.clientX - line.getBoundingClientRect().x)/line.getBoundingClientRect().width * 100 
                            if (tumbler.nextSibling){
                                callback({startPos: bias})
                            }
                            else(callback({endPos: bias }) )
                        }
                        document.onmouseup = e=>{
                            root.onmousemove = null;
                            document.onmouseup = null;
                        }
                    }
                    elem.onfocus = (e: MouseEvent)=>{
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
                            document.onkeydown = null;
                        }
                    }
                } );
            }
        };
        SelectedClass = class{
            element: HTMLElement;
            html: string;
            orient: string;
            color: string;
            weight: string;
            roundness: string;
            constructor(data: {roundness: string, orient: string,color: string, weight:string}){
                this.html = "<div class='RangeSlider__selected'></div>"
                this.orient = data.orient
                this.color = data.color;
                this.weight = data.weight;
                this.roundness = data.roundness;
                
            }
            render(){
                let selected = this.element = root.querySelector(".RangeSlider__selected")
                if(this.orient == "vertical") selected.style.marginLeft =  `calc( (-${this.weight} + ${selected.parentElement.style.width}) /2)`
                else selected.style.marginTop = `calc( (-${this.weight} + ${selected.parentElement.style.height}) /2)`
                if(this.orient == "vertical") selected.style.width = this.weight
                else selected.style.height = this.weight
                selected.style.background = this.color
                selected.style.borderRadius = this.roundness
            }
        }

        constructor({orient = "horizontal",type= "range", origin = 0, range = 100, meanings=true, interval=10, list=[null],  tumblerSize="20px", tumblerColor="darkblue", tumblerRoundness="50%", tumblerBorders = "none", 
                    lineWeight="12px", lineColor="grey",  lineRoundness="10px", selectedBackground="blue", selectedWeight = "16px", pointerLength = "0px", fontSize="12px", pointerColor="grey", pointerColorSelect="blue", pointerScale=1.3}){
            this.element
            this.orient = orient
            this.meaning = meanings
            
            this.tumbler = new this.TumblerClass({orient: orient, type: type, size:tumblerSize ,color:tumblerColor,roundness:tumblerRoundness, borders: tumblerBorders})

            this.line = new this.LineClass({orient: orient, weight: lineWeight,color: lineColor, roundness: lineRoundness})

            this.selected = new this.SelectedClass({roundness: lineRoundness, orient: orient, weight: selectedWeight, color: selectedBackground})
        
            if(this.meaning) this.meanings = new this.meaningsClass({list: list, orient: orient, origin: origin, range: range, interval: interval, color: pointerColor, colorActive: pointerColorSelect, length: pointerLength, fontSize:fontSize,scale: pointerScale })
        }
        render():void{
            root.innerHTML =  `<div class='RangeSlider RangeSlider_orient_${this.orient}'><div class='RangeSlider__line'> ${this.selected.html}${this.tumbler.html}${this.tumbler.html}</div> <div class='RangeSlider__meanings'></div> </div></div>`;

            this.line.render()

            if(this.meaning) this.meanings.render(this.tumblerShifted)
            
            this.tumbler.render(this.tumblerShifted)

            this.selected.render()

            this.element = root.querySelector(".RangeSlider")
        }

        viewUpdate(firPos:number, secPos:number){
            if(this.orient == "vertical"){
                (this.tumbler.elements[0]as HTMLElement).style.bottom = firPos + "%";
                (this.tumbler.elements[1]as HTMLElement).style.bottom = secPos  + "%"
                this.selected.element.style.bottom = firPos + "%"
                this.selected.element.style.top = 100 - secPos + "%"
                
            }
            else{
                (this.tumbler.elements[0]as HTMLElement).style.left = firPos + "%";
                (this.tumbler.elements[1]as HTMLElement).style.left = secPos  + "%"
                this.selected.element.style.left = firPos + "%"
                this.selected.element.style.right = 100 - secPos + "%"
            }
            if(this.meaning) this.meanings.update(firPos, secPos)
        }
    }

    const RangeSlider = { 

        Model: new clModel(options),
        Presenter: new ClPresenter(options),
        View: new clView(options),

        init: function(){

            this.View.tumblerShifted = this.Presenter.shiftReac.bind(this.Presenter)
            this.Presenter.callToModel = this.Model.update.bind(this.Model)
            this.Model.updated = this.Presenter.updateReact.bind(this.Presenter)
            this.Presenter.callToView = this.View.viewUpdate.bind(this.View)

            this.View.render()  
            
            this.Presenter.shiftReac({})
        },
        getValue(){
            console.log(`Selected range: ${this.Model.value[0]} — ${this.Model.value[1]}`)
            return this.Model.value
        },
        setValue(start:number, end:number){
            this.Presenter.shiftReac({startPos: start, endPos: end, method: "direct"})
            
        },
    }
    return RangeSlider
    
}
let elem = document.querySelector(".wrapper>div")
let elem2 = document.querySelector(".wrapper-two>div")
let elem3 = document.querySelector(".wrapper-three>div")
let elem4 = document.querySelector(".wrapper-list>div")

let slider = CreateSlider.call(elem, {type: "range",start:20, end : 80, step: 10} )
let slider2 = CreateSlider.call(elem2, {type: "point", origin: 10, range: 90, end:10, step: 5, interval: 20, pointerLength:"10px", pointerScale:1} )
let slider3 = CreateSlider.call(elem3, {type: "point", orient:"vertical", origin: 0, interval: 1, range: 10, end:5, pointerLength:"10px"} )
let slider4  = CreateSlider.call(elem4, {type: "range", list: ["Я", "Мы", "Вы", "Ты"], end: 2})

slider.init()
slider2.init()
slider3.init()
slider4.init()





