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
        set end(prc:number){
            this._end = Math.max(this.start, Math.min(prc, this.range) )
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
        update({startPrc=this.start, endPrc=this.end, direct=false}):void{
            if(direct){
                this._end = 100/this.range*(endPrc-this.origin)
                this._start =100/this.range*(startPrc-this.origin )
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
        line: {height: string; color: string; roundness: string; borders: string; element: HTMLElement}
        selected : {color: string; height: string;}

        LineClass = class{
            element: HTMLElement;
            height: string;
            color: string;
            roundness: string;
            borders: string;
            constructor({height= "12px",color = "blue", roundness="10px"}){
                this.height = height;
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

        constructor({orient = "horizontal", range = 100, origin = 0, start = 0, end = null, tumblerSize="16px", tumblerColor="darkblue", 
                    tumblerRoundness="50%", tumblerBorders = "none", lineHeight="12px", lineColor="blue",  lineRoundness="10px", selectedBackGround="blue",}){
            
            this.element
            this.orient = orient
            this.range = range
            this.origin = origin
            this.start = Math.max(start - origin, 0)
            this.end = (end === null ? range : (end-origin))
           
            this.tumbler = new this.TumblerClass({size:tumblerSize ,color:tumblerColor,roundness:tumblerRoundness, borders: tumblerBorders})
            this.tumbler.tumblerListener = this.tumbler.tumblerListener.bind(this)
            
            this.line = new this.LineClass({height: lineHeight,color: lineColor, roundness: lineRoundness})
            
        }
        render(): HTMLElement{
            root.innerHTML = `<div class='RangeSlider RangeSlider_orient_${this.orient}'><div class='RangeSlider__line'>${this.tumbler.html}${this.tumbler.html}</div>  <div class='RangeSlider__meaning'></div> </div></div>`;
            
            this.element = root.querySelector(".RangeSlider")
            
            this.line.element = this.element.querySelector(".RangeSlider__line") as HTMLElement
            
            this.tumbler.elements = this.element.querySelectorAll(".RangeSlider__tumbler") 

            this.tumbler.elements.forEach(el=>{ 
                let elem = (el as HTMLElement)
                elem.style.height = this.tumbler.size 
                elem.style.width = this.tumbler.size 
                elem.style.background = this.tumbler.color
                elem.style.borderRadius = this.tumbler.roundness
                elem.style. border = this.tumbler.borders
                elem.style.transform = "translateX(-50%)"
                elem.style.marginTop =  `calc((-${this.tumbler.size} + ${this.line.height})/2)`
               

                elem.onmousedown = e=>{this.tumbler.tumblerListener(e)}
            } );
            this.line.element.style.height = this.line.height
            this.line.element.style.background = this.line.color
            this.line.element.style.borderRadius = this.line.roundness

            this.viewUpdate(100/this.range * this.start, 100/this.range * this.end)
            return this.element
        }
        viewUpdate(firPos:number, secPos:number){ 
            (this.element.querySelector(".RangeSlider__tumbler:first-child") as HTMLElement).style.left = firPos + "%";
            (this.element.querySelector(".RangeSlider__tumbler:last-child") as HTMLElement).style.left = secPos  + "%"
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
            this.Presenter.shiftReac({startPrc: start/this.Model.range * 100, endPrc: end/this.Model.range*100, direct: true})
            
        },
    }
    return RangeSlider
    
}
let elem = document.querySelector(".wrapper>div")
let slider = CreateSlider.call(elem, {type: "range",start:20, end : 80, step: 5} )

slider.init()

slider.getValue()






