import { FunctionBase } from "lodash";
import "./main.scss"

function CreateSlider(options:object){  
    const root = this as HTMLElement
    
    const clModel = class{
        type: string;
        private _start: number;
        private _end: number;
        range: number;
        origin: number;
        step:number;
        value: Array<number>;
        set start(prc:number){
            this._start = Math.min(this.end, Math.max(prc, 0) )
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
        
        constructor({type= "range", range = 100,  start = 0, end=null, origin = 0, step=1}){
            this.type = type
            this._start = Math.max(start - origin, 0)
            this._end = (end === null ? range : (end-origin))
            this.range = range
            this.origin = origin
            this.step = step
            this.value = [this.start + this.origin, this.end + this.origin]
            
        }
        update({startPrc=100/this.range*this.start, endPrc=100/this.range*this.end, direct=false}):void{
            if(direct){
                this.end = this.range/100*endPrc
                this.start =this.range/100*startPrc
                //Prc я обозначаю "проценты", но не в случае выше. Тут абсолютные значения будут поступать через прямой ввод
            }
            else{
                let newStart = this.range/100*startPrc
                let newEnd = this.range/100*endPrc
                if((newEnd - this.end) >= this.step*0.7 || (this.end - newEnd) >= this.step*0.7 || newEnd==this.range){
                    this.end = Math.round(newEnd/this.step)*this.step
                }
                if((newStart - this.start) >= this.step*0.7 || (this.start - newStart) >= this.step*0.7 || newStart==0){
                    this.start = Math.round(newStart/this.step)*this.step
                }
            }
       
            this.value = [this.start + this.origin, this.end + this.origin]
            this.updated(100/this.range*this.start, 100/this.range*this.end)
        }
    }


    const ClPresenter = class{
        callToModel: Function;
        callToView: Function;
        constructor(){ 
          
        }
        shiftReac(params: object){
            this.callToModel(params)

        }
        updateReact(firCoor:number, secCoor:number){
            this.callToView(firCoor, secCoor)

        }
    }

    const clView = class{
        element: HTMLElement;
        origin: number;
        size: number;
        range: number;
        orient: string;
        start:number;
        end: number;
        tumblerShifted: Function;
        tumbler: {html: string; elements:NodeListOf<Element>;  size: string; color: string; roundness: string; borders: string; tumblerListener: EventListener};
        line: {element: HTMLElement; weight: string; color: string; roundness: string; borders: string;}
        selected : {html: string; element: HTMLElement; color: string; weight: string;}

        LineClass = class{
            element: HTMLElement;
            weight: string;
            color: string;
            roundness: string;
            borders: string;
            constructor({weight= "12px",color = "blue", roundness="10px"}){
                this.weight = weight;
                this.color = color
                this.roundness = roundness
            }
        }
        TumblerClass = class{
            html: string;
            elements: NodeListOf<HTMLElement>
            size: string;
            color: string;
            roundness: string;
            borders: string;

            tumblerShifted:Function; //Чтобы TS не выдавал ошибку. tumblerListener на самом-то деле будет запускаться в контесте View. Из-за данных. 
            
            constructor({ size="16px", color="darkblue", roundness="50%", borders = "none"}){
                this.html = `<span ondragstart="return false;" ondrop="return false;" class='RangeSlider__tumbler
                            '> </span>`
                this.size = size;
                this.color = color;
                this.roundness = roundness;

            }
            tumblerListener(e: MouseEvent): void{
                root.onmousemove = ev=>{
                    let tumbler = <HTMLElement>e.target;
                    let line= root.querySelector(".RangeSlider")
                    let bias = (ev.clientX - line.getBoundingClientRect().x)/line.getBoundingClientRect().width * 100
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
        };
        SelectedClass = class{
            element: HTMLElement;
            html: string;
            color: string;
            weight: string;
            constructor({color="darkblue", weight="14px"}){
                this.html = "<div class='RangeSlider__selected'></div>"
                this.color = color;
                this.weight = weight;
                
            }
        }

        constructor({orient = "horizontal", range = 100, origin = 0, start = 0, end = null, tumblerSize="20px", tumblerColor="darkblue", 
                    tumblerRoundness="50%", tumblerBorders = "none", lineWeight="12px", lineColor="grey",  lineRoundness="10px", selectedBackground="blue", selectedWeight = "16px"}){
            
            this.element
            this.orient = orient
            this.range = range
            this.origin = origin
            this.start = Math.max(start - origin, 0)
            this.end = (end === null ? range : (end-origin))
           
            this.tumbler = new this.TumblerClass({size:tumblerSize ,color:tumblerColor,roundness:tumblerRoundness, borders: tumblerBorders})
            this.tumbler.tumblerListener = this.tumbler.tumblerListener.bind(this)
            
            this.line = new this.LineClass({weight: lineWeight,color: lineColor, roundness: lineRoundness})

            this.selected = new this.SelectedClass({weight: selectedWeight, color: selectedBackground})
            
        }
        render(): HTMLElement{
            root.innerHTML = `<div class='RangeSlider RangeSlider_orient_${this.orient}'><div class='RangeSlider__line'> ${this.selected.html}  ${this.tumbler.html}${this.tumbler.html}</div>  <div class='RangeSlider__meaning'></div> </div></div>`;
            this.element = root.querySelector(".RangeSlider")
            
            this.tumbler.elements = this.element.querySelectorAll(".RangeSlider__tumbler") 
            this.tumbler.elements.forEach(el=>{ 
                let elem = (el as HTMLElement)
                elem.style.height = this.tumbler.size 
                elem.style.width = this.tumbler.size 
                elem.style.background = this.tumbler.color
                elem.style.borderRadius = this.tumbler.roundness
                elem.style. border = this.tumbler.borders
                elem.style.transform = "translateX(-50%)"
                elem.style.marginTop =  `calc((-${this.tumbler.size} + ${this.line.weight})/2)`
                elem.onmousedown = e=>{this.tumbler.tumblerListener(e)}
            } );

            let line = this.line.element = this.element.querySelector(".RangeSlider__line") as HTMLElement
            line.style.height = this.line.weight
            line.style.background = this.line.color
            line.style.borderRadius = this.line.roundness

            let selected = this.selected.element = this.element.querySelector(".RangeSlider__selected")
            selected.style.marginTop =  `calc((-${this.selected.weight} + ${this.line.weight})/2)`
            selected.style.height = this.selected.weight
            selected.style.background = this.selected.color
            

            this.viewUpdate(100/this.range * this.start, 100/this.range * this.end)
            return this.element
        }
        viewUpdate(firPos:number, secPos:number){ 
            (this.tumbler.elements[0]as HTMLElement).style.left = firPos + "%";
            (this.tumbler.elements[1]as HTMLElement).style.left = secPos  + "%"
            this.selected.element.style.left = firPos + "%"
            this.selected.element.style.right = 100 - secPos + "%"

        }
    }


    const RangeSlider = { 

        Model: new clModel(options),
        Presenter: new ClPresenter(),
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

let slider = CreateSlider.call(elem, {type: "range",start:20, end : 80, step: 5} )
let slider2 = CreateSlider.call(elem2, {type: "range", origin: 10, range: 90, start:20, end :80, step: 5} )

slider.init()
slider2.init()






