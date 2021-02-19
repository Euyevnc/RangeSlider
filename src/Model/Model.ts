export class Model implements ModelI{
    config: ConfigI;
    observer: ObserverI;
    private start: number;
    private end: number;
    constructor(options:ConfigI, observer: ObserverI){
        this.config = options
        this.observer = observer
    }
    
    updateConfig(data: {startPos: number, endPos: number, method: string}):void{
        let config = this.config;
        let callback = this.observer.broadcast
        let{type, origin, range, step} = config;
        let method = data.method

        let currentStart = this.start || 0 
        let currentEnd = this.end || range

        let newStart: number
        let newEnd: number

        if(method == 'direct') changeByDirect(data.startPos-origin, data.endPos - origin)
        else if(method == 'tepping') changeByTepping(data.startPos, data.endPos)
        else if(method == "drag") changeByDrag(data.startPos, data.endPos)
        else if(method == "scaleClick") changeByScaleClick(data.startPos-origin)
        
        if(method !== "direct"){
            if(!newStart && newStart !== 0) newStart = currentStart
            if(!newEnd && newEnd !== 0) newEnd =currentEnd 

            let maxStartValue = type == 'point' ?
                0
                :
                Math.max( (Math.ceil(newEnd/step)*step - step), currentStart)

            let minEndValue = type == 'point' ? 
                0 
                :
                Math.min( (Math.floor(newStart/step)*step + step), currentEnd)

            newStart = Math.min(Math.max(newStart, 0), Math.max(maxStartValue, 0 ) )
            newEnd = Math.max( Math.min(newEnd, range), Math.min(minEndValue, range) )
        }
        
        if(newStart !== currentStart || newEnd !== currentEnd || method == 'direct'){
            this.start = newStart
            this.end = newEnd
            config.value = [newStart + origin, newEnd + origin]
            callback({firCoor: 100/range*newStart, secCoor: 100/range*newEnd})
        }
        
        /////////////
        function changeByDirect(startPos:number, endPos:number){
            let maxStartValue = type == 'point' ? 0 : range-1
            let minEndValue = type == 'point' ? 0 : 1 

            if(!startPos && startPos !== 0 ) newStart = currentStart
            else newStart = startPos
            if(!endPos && endPos !== 0) newEnd = currentEnd 
            else newEnd = endPos
    
            newEnd = Math.min(Math.max(newEnd , minEndValue), range)
            newStart =  Math.min( Math.max(newStart, 0), maxStartValue )

            if(newStart>=newEnd && !(newEnd == 0 && type == 'point')){
                newEnd = currentEnd
                newStart = currentStart 
            }
        }
        function changeByTepping(startPos:number, endPos:number){
            if(startPos){ 
                if(startPos<0) newStart =  Math.ceil(currentStart/step)*step + step*startPos
                if(startPos>0) newStart =  Math.floor(currentStart/step)*step + step*startPos

            }
            if(endPos){
                if(endPos<0) newEnd =  Math.ceil(currentEnd/step)*step + step*endPos
                if(endPos>0) newEnd =  Math.floor(currentEnd/step)*step + step*endPos
            }
        }

        function changeByScaleClick(position:number){
            if(type == "point" || Math.abs(position - currentEnd)<=Math.abs(position - currentStart) ){
                newEnd = position
            }
            else newStart = position
        }
    
        function changeByDrag(startPos:number, endPos:number){
            if(startPos || startPos == 0){
                let cursorPosition = range/100*startPos
                let conditionOfTrigger 
                let cursorFarEnough = (cursorPosition - currentStart) >= step*0.8 || (currentStart - cursorPosition) >= step*0.8
                let cursorOverMakup = (cursorPosition%step > step*0.8 || cursorPosition%step <step*0.2 )
                conditionOfTrigger = cursorFarEnough || cursorOverMakup

                if(conditionOfTrigger){
                    newStart = Math.round(cursorPosition/step)*step
                }
            }
            if(endPos || endPos == 0){
                let cursorPosition = range/100*endPos
                let conditionOfTrigger 
                let cursorFarEnough = (cursorPosition - currentEnd  >= step*0.8) || (currentEnd - cursorPosition >= step*0.8)
                let cursorOverMakup = (cursorPosition%step > step*0.8 ||cursorPosition%step <step*0.2 )
                let cursorOverFinish = cursorPosition >= range
                conditionOfTrigger = cursorFarEnough || cursorOverMakup || cursorOverFinish
     
                if(conditionOfTrigger){
                    newEnd = Math.round(cursorPosition/step)*step
                }
            }     
        }
    }
};
