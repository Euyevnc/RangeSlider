import { FunctionBase } from "lodash";
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
        
        constructor({ range = 100,  start = 0, end=null, origin = 0, step=1}){
            this._start = Math.max(start - origin, 0) 
            this._end = end === null ? range : Math.min(range, Math.max(this.start, end-origin) ) 
            this.range = range
            this.origin = origin
            this.step = step
            this.value = [this.start + this.origin, this.end + this.origin]
            
        }
        update(data: {startPrc: number, endPrc: number, direct:boolean, tepping_first: number, tepping_last: number}):void{
           
            if(data.direct){
                this.end = data.endPrc !== undefined ? 100/this.range* (data.endPrc - this.origin) : this.end
                this.start = data.startPrc !== undefined ? 100/this.range* (data.startPrc - this.origin) : this.start
                //Prc я обозначаю "проценты", но не в случае выше. Тут абсолютные значения будут поступать через прямой ввод
            }
            else if(data.tepping_first || data.tepping_last){
                if(data.tepping_first){
                    this.start += data.tepping_first*this.step
                }
                if(data.tepping_last){
                    this.end += data.tepping_last*this.step
                }
            }
            else{
                let newStart = this.range/100*data.startPrc 
                let newEnd = this.range/100*data.endPrc
                if((newEnd - this.end) >= this.step*0.7 || (this.end - newEnd) >= this.step*0.7 || newEnd==this.range){
                    this.end = Math.round(newEnd/this.step)*this.step
                }
                if((newStart - this.start) >= this.step*0.7 || (this.start - newStart) >= this.step*0.7 || newStart==0){
                    this.start = Math.round(newStart/this.step)*this.step
                }
            }
       
            this.value = [this.start + this.origin, this.end + this.origin]
            console.log(this.value)
            this.updated(100/this.range*this.start, 100/this.range*this.end)
        }
    }


    const ClPresenter = class{
        inversion: boolean;

        callToModel: Function;
        callToView: Function;

        constructor({orient = "horizontal"}){ 
            if(orient === "vertical") this.inversion = true
            else this.inversion = false
        }
        shiftReac(data: {endPrc: number, startPrc: number}){
            if(!this.inversion){this.callToModel(data)}
            else{
                if(data.endPrc)data.endPrc = 100 - data.endPrc
                if(data.startPrc)data.startPrc = 100 - data.startPrc
                this.callToModel(data)
            }
        }
        updateReact(firCoor:number, secCoor:number){
            this.callToView(firCoor, secCoor)

        }
    }

    const clView = class{
        element: HTMLElement;
        orient: string;
        type: string;
        origin: number;
        size: number;
        range: number;
        start:number;
        end: number;
        tumblerShifted: Function;
        tumbler: {html: string; elements:NodeListOf<Element>;  size: string; color: string; roundness: string; borders: string; onclick: EventListener; onfocus: EventListener};
        line: {element: HTMLElement; weight: string; color: string; roundness: string; borders: string;}
        selected : {html: string; element: HTMLElement; color: string; weight: string;}

        LineClass = class{
            element: HTMLElement;
            weight: string;
            color: string;
            roundness: string;
            borders: string;
            constructor(data: {weight: string,color: string, roundness: string}){
                this.weight = data.weight;
                this.color = data.color
                this.roundness = data.roundness
            }
        }
        TumblerClass = class{
            html: string;
            elements: NodeListOf<HTMLElement>
            size: string;
            color: string;
            roundness: string;
            borders: string;

            tumblerShifted:Function; 
            orient: string; 
            //Чтобы TS не выдавал ошибку. onclick на самом-то деле будет запускаться в контесте View. . 
            //Хотелось листенер поместить в ползунок, но ориентацию и коллбэк ему по-сути знать не нужно


            constructor(data: { size:string, color:string, roundness:string, borders :string}){
                this.html = `<span tabindex= "1"; class='RangeSlider__tumbler'> </span>`
                this.size = data.size;
                this.color = data.color;
                this.roundness = data.roundness;

            }
            onclick(e: MouseEvent): void{
                e.preventDefault()
                root.onmousemove = ev=>{
                    let tumbler = <HTMLElement>e.target;
                    let line= root.querySelector(".RangeSlider")
                    let bias = this.orient === "vertical" ? 
                                (ev.clientY - line.getBoundingClientRect().y)/line.getBoundingClientRect().height * 100
                                :
                                (ev.clientX - line.getBoundingClientRect().x)/line.getBoundingClientRect().width * 100 
                                
                                 
                    if ( tumbler.nextSibling){
                        this.tumblerShifted({startPrc: bias})
                    }
                    else(this.tumblerShifted({endPrc: bias }) )
                    
                }
                document.onmouseup = e=>{
                    root.onmousemove = null;
                    document.onmouseup = null;
                }
            }
            onfocus(ev:FocusEvent ):void{
                let first = Boolean((<HTMLElement>ev.target).nextSibling)
                document.onkeydown = e=>{
                    if(first){
                        if( (e.key === "ArrowDown" && this.orient ==="vertical") || (e.key === "ArrowLeft" && this.orient !=="vertical")){
                            this.tumblerShifted({tepping_first: -1})
                        } 
                        else if( (e.key === "ArrowUp" && this.orient ==="vertical") || (e.key === "ArrowRight" && this.orient !=="vertical")){
                            this.tumblerShifted({tepping_first: 1})
                        }
                    }
                    else{
                        if( (e.key === "ArrowDown" && this.orient ==="vertical") || (e.key === "ArrowLeft" && this.orient !=="vertical")){
                            this.tumblerShifted({tepping_last: -1})
                        } 
                        else if( (e.key === "ArrowUp" && this.orient ==="vertical") || (e.key === "ArrowRight" && this.orient !=="vertical")){
                            this.tumblerShifted({tepping_last: 1})
                        }
                    }
                    
                }
                (<HTMLElement>ev.target).onblur = e=>{
                    document.onkeydown = null;
                }
            }
        };
        SelectedClass = class{
            element: HTMLElement;
            html: string;
            color: string;
            weight: string;
            constructor(data: {color: string, weight:string}){
                this.html = "<div class='RangeSlider__selected'></div>"
                this.color = data.color;
                this.weight = data.weight;
                
            }
        }

        constructor({orient = "horizontal",type= "range",tumblerSize="20px", tumblerColor="darkblue", tumblerRoundness="50%", tumblerBorders = "none", 
                    lineWeight="12px", lineColor="grey",  lineRoundness="10px", selectedBackground="blue", selectedWeight = "16px"}){
            this.element
            this.orient = orient
            this.type = type
           
            this.tumbler = new this.TumblerClass({size:tumblerSize ,color:tumblerColor,roundness:tumblerRoundness, borders: tumblerBorders})
            this.tumbler.onclick = this.tumbler.onclick.bind(this)
            this.tumbler.onfocus = this.tumbler.onfocus.bind(this)

            this.line = new this.LineClass({weight: lineWeight,color: lineColor, roundness: lineRoundness})

            this.selected = new this.SelectedClass({weight: selectedWeight, color: selectedBackground})
        }
        render(): HTMLElement{
            root.innerHTML =  `<div class='RangeSlider RangeSlider_orient_${this.orient}'><div class='RangeSlider__line'> ${this.selected.html}  ${this.tumbler.html}${this.tumbler.html}</div>  <div class='RangeSlider__meaning'></div> </div></div>`;
            this.element = root.querySelector(".RangeSlider")
            
            this.tumbler.elements = this.element.querySelectorAll(".RangeSlider__tumbler") 
            this.tumbler.elements.forEach((el, i)=>{ 
                let elem = (el as HTMLElement)
                elem.style.height = this.tumbler.size 
                elem.style.width = this.tumbler.size 
                elem.style.background = this.tumbler.color
                elem.style.borderRadius = this.tumbler.roundness
                elem.style. border = this.tumbler.borders
                elem.style.transform = this.orient == "vertical" ? "translateY(50%)" : "translateX(-50%)"
                if(this.orient == "vertical") elem.style.marginLeft =  `calc((-${this.tumbler.size} + ${this.line.weight})/2)`
                else elem.style.marginTop =  `calc((-${this.tumbler.size} + ${this.line.weight})/2)`

                if(this.type === "point" && i===0) elem.style.display = "none"
                elem.onmousedown = e=>{this.tumbler.onclick(e)}
                elem.onfocus = e => {this.tumbler.onfocus(e)}
            } );

            let line = this.line.element = this.element.querySelector(".RangeSlider__line") as HTMLElement
            if(this.orient == "vertical") line.style.width = this.line.weight
            else line.style.height = this.line.weight
            line.style.background = this.line.color
            line.style.borderRadius = this.line.roundness

            let selected = this.selected.element = this.element.querySelector(".RangeSlider__selected")
            if(this.orient == "vertical") selected.style.marginLeft =  `calc((-${this.selected.weight} + ${this.line.weight})/2)`
            else selected.style.marginTop =  `calc((-${this.selected.weight} + ${this.line.weight})/2)`
            if(this.orient == "vertical") selected.style.width = this.selected.weight
            else selected.style.height = this.selected.weight
            selected.style.background = this.selected.color
            selected.style.borderRadius = this.line.roundness
            

            if (this.type == "point") this.tumblerShifted({startPrc: 0})
            else this.tumblerShifted({})
            return this.element
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
        },
        getValue(){
            console.log(`Selected range: ${this.Model.value[0]} — ${this.Model.value[1]}`)
            return this.Model.value
        },
        setValue(start:number, end:number){
            this.Presenter.shiftReac({startPrc: (start-this.Model.origin)/this.Model.range * 100, endPrc: (end-this.Model.origin)/this.Model.range*100, direct: true})
            
        },
    }
    return RangeSlider
    
}
let elem = document.querySelector(".wrapper>div")
let elem2 = document.querySelector(".wrapper-two>div")
let elem3 = document.querySelector(".wrapper-three>div")

let slider = CreateSlider.call(elem, {type: "range",start:20, end : 80, step: 5} )
let slider2 = CreateSlider.call(elem2, {type: "point", origin: 10, range: 90, end:10, step: 5} )
let slider3 = CreateSlider.call(elem3, {type: "point", orient:"vertical", origin: 0, end:5, range: 10} )

slider.init()
slider2.init()
slider3.init()






