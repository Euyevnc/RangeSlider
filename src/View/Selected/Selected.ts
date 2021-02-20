export class Selected{
    element: HTMLElement;
    config: ConfigI;

    constructor(option: ConfigI){
        this.config = option
    }

    render(){
        let config = this.config;
        let selectedElement

        selectedElement = document.createElement("div")
        selectedElement.className = `range-slider__selected  range-slider__selected_for_${config.orient}`

        this.element = selectedElement 
        return this.element
    }
    update(firCoor: number, secCoor: number){
        let config = this.config;
        let selectedElement = this.element

        if(config.orient == "vertical"){
            selectedElement.style.bottom = firCoor + "%"
            selectedElement.style.top = 100 - secCoor + "%"
            
        }
        else{
            selectedElement.style.left = firCoor + "%"
            selectedElement.style.right = 100 - secCoor + "%"
        }
    }
}