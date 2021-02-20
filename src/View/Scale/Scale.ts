export class Scale{
    element: HTMLElement;
    config: ConfigI;

    constructor(option: ConfigI){
        this.config = option
    }
    render(callback:Function){
        let config = this.config
        let intervals = Math.ceil(config.range/ config.scaleInterval)
        let isList = Boolean(config.list.length)

        let scaleElement =  document.createElement("div")
        scaleElement.className = `range-slider__scale  range-slider__scale_for_${config.orient}`;
        
        createCell(config.origin)
        for( let i=1; i<intervals; i++){
            if(i !==intervals-1) {
                createCell(i*config.scaleInterval+config.origin)
            }
            else createCell(i*config.scaleInterval+config.origin).style.flexShrink = "1"
        };
        config.orient == "vertical" ? 
            createCell(config.range+config.origin).style.height = "0px"
            :
            createCell(config.range+config.origin).style.width = "0px"
        ;

        if(!config.scale) scaleElement.style.display = "none"
        this.element = scaleElement
        return this.element;

        ////////////
        function createCell(int:number){
            let cell = document.createElement("span")
            cell.className = (`js-range-slider__cell range-slider__cell  range-slider__cell_for_${config.orient}`)
            if(config.orient == "vertical"){
                cell.style.height = config.scaleInterval/config.range*100 + "%"
            }
            else{
                cell.style.width = config.scaleInterval/config.range*100 + "%"
            };
            cell.classList.add(`range-slnider__cell_meaning_${int}`)
            cell.setAttribute("value", `${int}`)

            let amountContainer = document.createElement("span")
            amountContainer.classList.add('range-slider__scale-value')
            amountContainer.innerHTML = isList ?
                config.list[int].toString()
                :
                int.toLocaleString();
            ;
            amountContainer.tabIndex = 0
            amountContainer.addEventListener("click", handlerCellClick)
            amountContainer.addEventListener("keydown", handlerCellKeydown)
            cell.append(amountContainer);

            scaleElement.append(cell);
            return cell
        }

        function handlerCellClick(event:MouseEvent){
            let value = +(<HTMLElement>event.target).closest(".range-slider__cell").getAttribute("value") 
            callback({startPos: value, method: "scaleClick"})
        }
        function handlerCellKeydown(event:KeyboardEvent){
            if(event.code!=='Enter') return
            let value = +(<HTMLElement>event.target).closest(".range-slider__cell").getAttribute("value") 
            callback({startPos: value, method: "scaleClick"})  
        }
    }
    update(firCoor: number, secCoor:number){
        let config = this.config
        let scaleElement = this.element

        let firValue = config.range/100*firCoor + config.origin
        let secValue = config.range/100*secCoor + config.origin
        scaleElement.querySelectorAll(".js-range-slider__cell").forEach(el=>{
            let elem = el as HTMLElement
            let valueInCell = +el.getAttribute("value")
            if(valueInCell>= firValue && valueInCell<=secValue ){
                elem.classList.add("range-slider__cell_status_active")
            }
            else{
                elem.classList.remove("range-slider__cell_status_active")
            } 
        })
    }
}