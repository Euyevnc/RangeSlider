import { FunctionBase } from "lodash";
import "./main.scss"

function CreateSlider(options:object){  
    const root = this as HTMLElement
    
    let clModel = class{
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
                this._end = this.range/100*endPrc
                this._start =this.range/100*startPrc 

            }
            else{
                let newStart = this.range/100*startPrc
                let newEnd = this.range/100*endPrc
                if((newEnd - this.end) >= this.step*0.7 || (this.end - newEnd) >= this.step*0.7 || newEnd==this.range){
                    this.end = Math.round(newEnd/this.step)*this.step
                }
                if((newStart - this.start) >= this.step*0.7 || (this.start - newStart) >= this.step*0.7 || newStart==0){
                    this.start = Math.round(newStart/this.step)*this.step
                    console.log(startPrc, this.start)
                }
            }
       
            this.value = [this.start + this.origin, this.end + this.origin]
            this.updated(100/this.range*this.start, 100/this.range*this.end)
        }
    }


    let ClPresenter = class{
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

    let clView = class{
        origin: number;
        size: number;
        range: number;
        root: HTMLElement;
        orient: string;
        start:number;
        end: number;

        tumbler: {tumblerSize:string;tumblerBackground:string;tumblerRadius:string}
        line: {lineHeight: string;lineBackground: string; lineRadius: string}

        tumblerShifted: Function;

        constructor({orient = "horizontal", range = 100, origin = 0, start = 0, end = null, tumblerSize="16px", tumblerBackground="darkblue", 
                    tumblerRadius="50%", lineHeight="12px", lineBackground="blue", selectedBackGround="blue", lineRadius="10px"}){
            this.root = root
            this.orient = orient
            this.range = range
            this.origin = origin
            this.start = Math.max(start - origin, 0)
            this.end = (end === null ? range : (end-origin))
            this.tumbler = {tumblerSize: tumblerSize,tumblerBackground:tumblerBackground,tumblerRadius:tumblerRadius}
            this.line = {lineHeight: lineHeight,lineBackground: lineBackground, lineRadius: lineRadius}
    
        }
        tumblerListener(e: MouseEvent): void{
            root.onmousemove = ev=>{
                let tumbler = <HTMLElement>e.target;
                let line= root.querySelector(".RangeSlider")
                let bias = (ev.clientX - line.getBoundingClientRect().x)/line.getBoundingClientRect().width * 100
                if ( tumbler.classList.contains("RangeSlider__tumbler_type_main") ){
                    this.tumblerShifted({startPrc: bias})
                }
                else(this.tumblerShifted({endPrc: bias }) )
                
            }
            document.onmouseup = e=>{
                root.onmousemove = null;
                document.onmouseup = null;
            }
        }
        render(): HTMLElement{
            this.root.innerHTML = `<div class='RangeSlider RangeSlider_orient_${this.orient}'><div class='RangeSlider__line'>   <span ondragstart="return false;" ondrop="return false;" class='RangeSlider__tumbler_type_main RangeSlider__tumbler'>
                                    </span> <span ondragstart="return false;" ondrop="return false;" class='RangeSlider__tumbler'></span>   </div>  <div class='RangeSlider__meaning'></div> </div></div>`;
            this.root.querySelectorAll(".RangeSlider__tumbler").forEach(el=>{ 
                let elem = (el as HTMLElement)
                elem.style.height = this.tumbler.tumblerSize 
                elem.style.width = this.tumbler.tumblerSize 
                elem.style.background = this.tumbler.tumblerBackground
                elem.style.borderRadius = this.tumbler.tumblerRadius
                elem.style.transform = "translateX(-50%)"
                elem.style.marginTop =  `calc((-${this.tumbler.tumblerSize} + ${this.line.lineHeight})/2)`
            
                elem.onmousedown = this.tumblerListener.bind(this)
            } );
            let line = root.querySelector(".RangeSlider__line") as HTMLElement
            line.style.height = this.line.lineHeight
            line.style.background = this.line.lineBackground
            line.style.borderRadius = this.line.lineRadius

            this.viewUpdate(100/this.range * this.start, 100/this.range * this.end)
            return root.querySelector(".RangeSlider")
        }
        viewUpdate(firPos:number, secPos:number){ 
            (this.root.querySelector(".RangeSlider__tumbler_type_main") as HTMLElement).style.left = firPos + "%";
            (this.root.querySelector(".RangeSlider__tumbler:last-child") as HTMLElement).style.left = secPos  + "%"
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






