import { FunctionBase } from "lodash";
import "./main.scss"

function CreateSlider(options:object){  
    const root = this as HTMLElement
    
    let clModel = class{
        type: string;
        start: number;
        end: number;
        range: number;
        origin: number;
        dataupdateReact: Function;
        value: Array<number>;
        constructor({type= "range", range = 100,  start = 0, end=null, origin = 0}){
            this.type = type
            this.start = Math.max(start - origin, 0)
            this.end = (end === null ? range : (end-origin))
            this.range = range
            this.origin = origin
            this.value = [this.start + this.origin, this.end + this.origin]
            
        }
        dataupdate({startPrc=this.start/this.range*100, endPrc=this.end/this.range*100}):void{
            this.start = Math.round(Math.min(this.end, this.range/100*startPrc ) )
            this.end = Math.round(Math.max(this.start,this.range/100*endPrc ) )
            this.value = [this.start + this.origin, this.end + this.origin]

            console.log(this.start, this.end)

            this.dataupdateReact(100/this.range*this.start, 100/this.range*this.end)
        }
    }


    let ClPresenter = class{
        setDate: Function;
        viewUpdate: Function;
        constructor(){ 
          
        }
        tumblerListener(e: MouseEvent): void{
            let target = e.target as HTMLElement
            const mousePosition = e.clientX;

            let demTumbler:number = target.getBoundingClientRect().x + target.getBoundingClientRect().width/2
            let demSlider:number = target.closest(".RangeSlider").getBoundingClientRect().x;
        
            root.onmousemove = ev=>{
                let lineSize = root.clientWidth - ( +(getComputedStyle(root).paddingLeft.slice(0, -2) ) +  +(getComputedStyle(root).paddingRight.slice(0, -2)) )
                let bias =( (ev.clientX - mousePosition)+(demTumbler-demSlider) )/lineSize * 100
                if (target.classList.contains("RangeSlider__tumbler_type_main") ){
                    this.setDate({startPrc: Math.max(bias, 0)})
                }
                else(this.setDate({endPrc:Math.min(bias, 100)}))
            }
            document.onmouseup = e=>{
                root.onmousemove = null;
                document.onmouseup = null;
            }
        }
        updateProxy(firCoor:number, secCoor:number){
            let lineSize = root.clientWidth - ( +(getComputedStyle(root).paddingLeft.slice(0, -2) ) +  +(getComputedStyle(root).paddingRight.slice(0, -2)) );
            let firOffset = (lineSize/100 * firCoor);
            let secOffset = (lineSize/100 * secCoor);
            this.viewUpdate(firOffset, secOffset)
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

        tumblerSize: string;
        tumblerBackground: string;
        tumblerRadius: string;
        lineHeight: string;
        lineBackground: string;
        lineRadius: string;

        clickReact: EventListener;
        constructor({orient = "horizontal", range = 100, origin = 0, start = 0, end = null, tumblerSize="16px", lineHeight="12px", 
                    tumblerBackground="darkblue", lineBackground="blue", selectedBackGround="blue", lineRadius="10px", tumblerRadius="50%"}){
            this.root = root
            this.orient = orient
            this.range = range
            this.origin = origin
            this.start = Math.max(start - origin, 0)
            this.end = (end === null ? range : (end-origin))
            
            //styles
            this.tumblerSize = tumblerSize
            this.tumblerRadius = tumblerRadius
            this.tumblerBackground=tumblerBackground
            this.lineHeight = lineHeight
            this.lineBackground = lineBackground
            this.lineRadius = lineRadius
        }
        create(): HTMLElement{
            this.root.innerHTML = `<div class='RangeSlider RangeSlider_orient_${this.orient}'><div class='RangeSlider__line'>   <span ondragstart="return false;" ondrop="return false;" class='RangeSlider__tumbler_type_main RangeSlider__tumbler'>
                                    </span> <span ondragstart="return false;" ondrop="return false;" class='RangeSlider__tumbler'></span>   </div>  <div class='RangeSlider__meaning'></div> </div></div>`;
            this.root.querySelectorAll(".RangeSlider__tumbler").forEach(el=>{ 
                let elem = (el as HTMLElement)
                elem.style.height = this.tumblerSize 
                elem.style.width = this.tumblerSize 
                elem.style.background = this.tumblerBackground
                elem.style.borderRadius = this.tumblerRadius
                elem.style.transform = "translateX(-50%)"
                elem.style.marginTop =  `calc((-${this.tumblerSize} + ${this.lineHeight})/2)`
            
                elem.onmousedown = this.clickReact
            } );
            let line = root.querySelector(".RangeSlider__line") as HTMLElement
            line.style.height = this.lineHeight
            line.style.background = this.lineBackground
            line.style.borderRadius = this.lineRadius


            let lineSize = root.clientWidth - ( +(getComputedStyle(root).paddingLeft.slice(0, -2) ) +  +(getComputedStyle(root).paddingRight.slice(0, -2)) );
            this.viewUpdate(lineSize/this.range * this.start, lineSize/this.range * this.end)
            return root.querySelector(".RangeSlider")
        }
        viewUpdate(firOffset:number, secOffset:number){ 
            (this.root.querySelector(".RangeSlider__tumbler_type_main") as HTMLElement).style.left = firOffset + "px";
            (this.root.querySelector(".RangeSlider__tumbler:last-child") as HTMLElement).style.left = secOffset  + "px"
        }
    }


    const RangeSlider = { 

        Model: new clModel(options),
        Presenter: new ClPresenter(),
        View: new clView(options),

        init: function(){
            const clickReact= this.Presenter.tumblerListener.bind(this.Presenter)
            const setDate= this.Model.dataupdate.bind(this.Model)
            const updateReact= this.Presenter.updateProxy.bind(this.Presenter)
            const viewUpdate= this.View.viewUpdate.bind(this.View)

            this.View.clickReact = clickReact
            this.Presenter.setDate = setDate
            this.Model.dataupdateReact = updateReact
            this.Presenter.viewUpdate = viewUpdate

            this.View.create()  
        },
        getValue(){
            console.log(`Selected range: ${this.Model.value[0]} — ${this.Model.value[1]}`)
            return this.Model.value
        },
        setValue(start:number, end:number){
            this.Presenter.setDate({startPrc: start/this.Model.range * 100, endPrc: end/this.Model.range*100})
        },
    }
    return RangeSlider
    
}
let elem = document.querySelector(".wrapper>div")
let slider = CreateSlider.call(elem, {type: "range",start:20, end : 80} )

slider.init()

slider.setValue(25, 76)

slider.getValue()






