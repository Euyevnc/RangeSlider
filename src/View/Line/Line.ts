export class Line{
    element: HTMLElement;
    config: ConfigI;
    constructor(option: ConfigI){
        this.config = option
    }

    render(){
        let config = this.config;

        let lineElement
        lineElement = document.createElement("div")
        lineElement.className = `range-slider__line  range-slider__line_for_${config.orient}`

        this.element = lineElement
        return this.element
    }
}