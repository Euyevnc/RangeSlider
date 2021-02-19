import {Tumblers} from "./Tumblers/Tumblers"
import {Selected} from "./Selected/Selected"
import {Scale} from "./Scale/Scale"
import {Line} from "./Line/Line"

export class View implements ViewI{
    root:HTMLElement;
    element: HTMLElement;
    config: ConfigI;
    observer: ObserverI;

    tumblers: Tumblers;
    line:     Line;
    selected: Selected;
    scale: Scale;
    callback: Function;

    constructor(root: HTMLElement, option: ConfigI, observer: ObserverI){
        this.element
        this.root = root
        this.config = option
        this.tumblers = new Tumblers(root, option)
        this.line = new Line(option)
        this.selected = new Selected(option)
        this.scale = new Scale(option)

        this.observer = observer
    }
    render():void{
        let root = this.root
        let config = this.config 
        let callback = this.observer.broadcast

        let mainElement = document.createElement("div")
        mainElement.className = `range-slider  js-range-slider  range-slider_for_${config.orient}`

        mainElement.append( this.line.render() )
        mainElement.append( this.scale.render(callback) )
        
        this.tumblers.render(callback).forEach((el:HTMLElement)=>{
            this.line.element.append(el)
        })
        this.line.element.append(this.selected.render())

        this.element = mainElement
        root.innerHTML = ""
        root.append(this.element);

        
    }
    updateView(data: {firCoor:number, secCoor:number}){
        let firCoor = data.firCoor
        let secCoor = data.secCoor
        
        this.tumblers.update(firCoor, secCoor)

        this.selected.update(firCoor, secCoor)

        this.scale.update(firCoor, secCoor)
    };
}