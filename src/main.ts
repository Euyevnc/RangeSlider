import jQuery from "jquery";
import "./RangeSlider/RangeSlider"
import "./main.scss"
import { Object } from "lodash";

window.addEventListener('DOMContentLoaded', (event) => {
    let block1 = jQuery(".first_wrapper>.panel")
    let slider1 = jQuery(".first_wrapper>div:last-child").RangeSlider({type: "range",start:20, end : 80, step: 1, scale:false, cloud: "always"})
    slider1.init()
    connectThePanel(block1, slider1)

    let block2 = jQuery(".second_wrapper>.panel")
    let slider2 = jQuery(".second_wrapper>div:last-child").RangeSlider({type: "point", origin: 10, range: 90, end:10, step: 5, scaleInterval: 20})
    slider2.init()
    connectThePanel(block2, slider2)

    let block3= jQuery(".third_wrapper>.panel")
    let slider3 = jQuery(".third_wrapper>div:last-child").RangeSlider({type: "point", orient:"vertical", origin: 0, scaleInterval: 5, range: 10, end:5})
    slider3.init()
    connectThePanel(block3, slider3)

    let block4= jQuery(".fourt_wrapper>.panel")
    let slider4 = jQuery(".fourt_wrapper>div:last-child").RangeSlider( {type: "range", list: ["ἄ", "β", "γ", "λ", "Ξ", "ζ", "π", "θ", "ψ"], end: 2, cloud:"none"})
    slider4.init()
    connectThePanel(block4, slider4)

});

function connectThePanel(panelNode: JQuery, sliderObject:sliderObjectI){
    let slider = sliderObject
    
    if(slider.config.type == "point"){
        panelNode.find("[name='type'][value='point']").prop('checked', true);
        panelNode.find("[name='first_pos']").prop("disabled", true)
    }
    else panelNode.find("[name='type'][value='range']").prop('checked', true);
    
    if(slider.config.cloud == "always") panelNode.find("[name='cloud'][value='yes']").prop('checked', true);
    else if(slider.config.cloud == "click") panelNode.find("[name='cloud'][value='click']").prop('checked', true);
    else panelNode.find("[name='cloud'][value='no']").prop('checked', true);
       
    if(slider.config.orient == "vertical") panelNode.find("[name='orient'][value='vertical']").prop('checked', true);
    else panelNode.find("[name='orient'][value='horizontal']").prop('checked', true);

    if(!slider.config.scale){
        panelNode.find("[name='interval']").prop("value", "")
        panelNode.find("[name='interval']").prop('disabled', true);
        panelNode.find("[name='scale'][value='no']").prop('checked', true);
    }
    else {
        panelNode.find("[name='scale'][value='yes']").prop('checked', true);
        panelNode.find("[name='interval']").prop("value", slider.config.scaleInterval)
    }
    if(!slider.config.list.length){
        panelNode.find("[name='list']").prop("value", "")
        panelNode.find("[name='list']").prop('disabled', true);
    }
    else{
        panelNode.find("[name='range']").prop("disabled", true)
        panelNode.find("[name='step']").prop("disabled", true)
        panelNode.find("[name='origin']").prop("disabled", true)
        panelNode.find("[name='interval']").prop("disabled", true)
        panelNode.find("[name='list']").prop("value", slider.config.list.toString())
    }

    panelNode.find("[name='origin']").prop("value", slider.config.origin)
    panelNode.find("[name='range']").prop("value", slider.config.range)
    panelNode.find("[name='step']").prop("value", slider.config.step)

    panelNode.find("[name='first_pos']").prop("value", slider.getValue()[0])
    panelNode.find("[name='second_pos']").prop("value", slider.getValue()[1])
    
    panelNode.find("[name='type']").each((i, e)=>{
        e.onchange = (event)=>{
            if(e.getAttribute("value") == "point"){
                slider.config.type = "point"
                slider.config.type = "point"
                slider.init()
                panelNode.find("[name='first_pos']").prop("disabled", true)
            }
            else{
                slider.config.type = "range"
                slider.config.type = "range"
                slider.init() 
                panelNode.find("[name='first_pos']").prop("disabled", false)
            }
            panelNode.find("[name='first_pos']").prop("value", slider.getValue()[0])
        } 
    })
    panelNode.find("[name='scale']").each((i, e)=>{
        e.onchange = (event)=>{
            if(e.getAttribute("value") == "yes"){
                slider.config.scale = true
                slider.init()
                if(!slider.config.list.length)panelNode.find("[name='interval']").prop('disabled', false);
                panelNode.find("[name='interval']").prop("value", slider.config.scaleInterval)
            }
            else{
                slider.config.scale = false
                slider.init() 
                panelNode.find("[name='interval']").prop('disabled', true);
            }
        }  
    })
    panelNode.find("[name='cloud']").each((i, e)=>{
        e.onchange = (event)=>{
            if(e.getAttribute("value") == "yes"){
                slider.config.cloud = "always"
                slider.init()
            }
            else if(e.getAttribute("value") == "click"){
                slider.config.cloud = "click"
                slider.init() 
            }
            else{
                slider.config.cloud = "none"
                slider.init() 
            }
        } 
    })
    panelNode.find("[name='orient']").each((i, e)=>{
        e.onchange = (event)=>{
            if(e.getAttribute("value") == "vertical"){
                slider.config.orient = "vertical"
                panelNode.next().addClass("for_vertical")
                slider.init()
            }
            else{
                slider.config.orient = "horizontal"
                slider.config.orient = "horizontal"
                panelNode.next().removeClass("for_vertical")
                slider.init() 
            }
        }  
    })

    panelNode.find("input[name='origin']").on("change", (e)=>{
        e.preventDefault()
        let value = Number((e.target as HTMLInputElement).value)
        slider.config.origin = value
        slider.init()
    })
    panelNode.find("input[name='origin']").on("submit", (e)=>{
        e.preventDefault()
    })

    panelNode.find("input[name='range']").on("change", (e)=>{
        e.preventDefault()
        let value = Math.max(Number((e.target as HTMLInputElement).value), 1);
        (e.target as HTMLInputElement).value = value.toString()
        slider.config.range = value
        slider.init()
    })
    panelNode.find("input[name='range']").on("submit", (e)=>{
        e.preventDefault()
    })
    panelNode.find("input[name='interval']").on("change", (e)=>{
        e.preventDefault()
        let value = Math.max(Number((e.target as HTMLInputElement).value), 1);
        (e.target as HTMLInputElement).value = value.toString()
        slider.config.scaleInterval = value
        slider.init()
    })
    panelNode.find("input[name='interval']").on("submit", (e)=>{
        e.preventDefault()
    })

    panelNode.find("input[name='list']").on("change", (e)=>{
        e.preventDefault()
        let value = (e.target as HTMLInputElement).value.split(",")
        slider.config.range = value.length-1
        slider.config.list = value
        slider.init()
        panelNode.find("input[name='range']").prop("value", slider.config.range)
        
    })
    panelNode.find("input[name='list']").on("submit", (e)=>{
        e.preventDefault()
    })
    panelNode.find("input[name='step']").on("change", (e)=>{
        e.preventDefault()
        let value = Math.max(Number((e.target as HTMLInputElement).value), 1);
        (e.target as HTMLInputElement).value = value.toString()
        slider.config.step = value
        slider.init()
    })
    panelNode.find("input[name='list']").on("submit", (e)=>{
        e.preventDefault()
    })

    panelNode.find("input[name='first_pos']").on("change", (e)=>{
        e.preventDefault()
        let value = Number((e.target as HTMLInputElement).value);
        slider.setValue(value);
        (e.target as HTMLInputElement).value = (slider.getValue()[0]).toString()
    })
    panelNode.find("input[name='first_pos']").on("submit", (e)=>{
        e.preventDefault()
    })

    panelNode.find("input[name='second_pos']").on("change", (e)=>{
        e.preventDefault()
        let value = Number((e.target as HTMLInputElement).value);
        slider.config.type == "point" ?
        slider.setValue(value)
            :
        slider.setValue(undefined, value);

        (e.target as HTMLInputElement).value = (slider.getValue()[1]).toString()
    })
    panelNode.find("input[name='second_pos']").on("submit", (e)=>{
        e.preventDefault()
    })

    slider.Presenter.OptionalCallback_updateReact = ()=>{
        panelNode.find("input[name='first_pos']").prop("value", slider.getValue()[0])
        panelNode.find("input[name='second_pos']").prop("value", slider.getValue()[1])
    }
    
}





