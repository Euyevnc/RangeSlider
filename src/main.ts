import jQuery from "jquery";
import "./RangeSlider/RangeSlider"
import "./main.scss"
import { Object } from "lodash";

window.addEventListener('DOMContentLoaded', (event) => {
    let block1 = jQuery(".first_wrapper>.panel")
    let slider1 = jQuery(".first_wrapper>div:last-child").RangeSlider({type: "range",start:20, end : 80, step: 1, scale:false, cloud: "always"})
    slider1.init()

    let block2 = jQuery(".second_wrapper>.panel")
    let slider2 = jQuery(".second_wrapper>div:last-child").RangeSlider({type: "point", origin: 10, range: 90, end:10, step: 5, scaleInterval: 20})
    slider2.init()

    let block3= jQuery(".third_wrapper>.panel")
    let slider3 = jQuery(".third_wrapper>div:last-child").RangeSlider({type: "point", orient:"vertical", origin: 0, scaleInterval: 5, range: 10, end:5})
    slider3.init()

    let block4= jQuery(".fourt_wrapper>.panel")
    let slider4 = jQuery(".fourt_wrapper>div:last-child").RangeSlider( {type: "range", list: ["ἄ", "β", "γ", "λ", "Ξ", "ζ", "π", "θ", "ψ"], end: 2, cloud:"none"})
    slider4.init()
    
    connectThePanel(block1, slider1)
    connectThePanel(block2, slider2)
    connectThePanel(block3, slider3)
    connectThePanel(block4, slider4)
});


function connectThePanel(panelNode: JQuery, sliderObject:RangeSliderObject){
    let slider = sliderObject
    
    if(slider.View.tumblers.type == "point"){
        panelNode.find("[name='type'][value='point']").prop('checked', true);
        panelNode.find("[name='first_pos']").prop("disabled", true)
    }
    else panelNode.find("[name='type'][value='range']").prop('checked', true);
    
    if(slider.View.tumblers.cloud == "always") panelNode.find("[name='cloud'][value='yes']").prop('checked', true);
    else if(slider.View.tumblers.cloud == "click") panelNode.find("[name='cloud'][value='click']").prop('checked', true);
    else panelNode.find("[name='cloud'][value='no']").prop('checked', true);
       
    if(slider.View.orient == "vertical") panelNode.find("[name='orient'][value='vertical']").prop('checked', true);
    else panelNode.find("[name='orient'][value='horizontal']").prop('checked', true);

    if(!slider.View.scale.display){
        panelNode.find("[name='interval']").prop("value", "")
        panelNode.find("[name='interval']").prop('disabled', true);
        panelNode.find("[name='scale'][value='no']").prop('checked', true);
    }
    else {
        panelNode.find("[name='scale'][value='yes']").prop('checked', true);
        panelNode.find("[name='interval']").prop("value", slider.View.scale.interval)
    }
    if(!slider.View.scale.list.length){
        panelNode.find("[name='list']").prop("value", "")
        panelNode.find("[name='list']").prop('disabled', true);
    }
    else{
        panelNode.find("[name='range']").prop("disabled", true)
        panelNode.find("[name='step']").prop("disabled", true)
        panelNode.find("[name='origin']").prop("disabled", true)
        panelNode.find("[name='interval']").prop("disabled", true)
        panelNode.find("[name='list']").prop("value", slider.View.scale.list.toString())
    }

    panelNode.find("[name='origin']").prop("value", slider.Model.origin)
    panelNode.find("[name='range']").prop("value", slider.Model.range)
    panelNode.find("[name='step']").prop("value", slider.Model.step)

    panelNode.find("[name='first_pos']").prop("value", slider.getValue()[0])
    panelNode.find("[name='second_pos']").prop("value", slider.getValue()[1])
    
    panelNode.find("[name='type']").each((i, e)=>{
        e.onchange = (event)=>{
            if(e.getAttribute("value") == "point"){
                slider.View.tumblers.type = "point"
                slider.Model.type = "point"
                slider.init()
                panelNode.find("[name='first_pos']").prop("disabled", true)
            }
            else{
                slider.View.tumblers.type = "range"
                slider.Model.type = "range"
                slider.init() 
                panelNode.find("[name='first_pos']").prop("disabled", false)
            }
            panelNode.find("[name='first_pos']").prop("value", slider.getValue()[0])
        } 
    })
    panelNode.find("[name='scale']").each((i, e)=>{
        e.onchange = (event)=>{
            if(e.getAttribute("value") == "yes"){
                slider.View.scale.display = true
                slider.init()
                if(!slider.View.scale.list.length)panelNode.find("[name='interval']").prop('disabled', false);
                panelNode.find("[name='interval']").prop("value", slider.View.scale.interval)
            }
            else{
                slider.View.scale.display = false
                slider.init() 
                panelNode.find("[name='interval']").prop('disabled', true);
            }
        }  
    })
    panelNode.find("[name='cloud']").each((i, e)=>{
        e.onchange = (event)=>{
            if(e.getAttribute("value") == "yes"){
                slider.View.tumblers.cloud = "always"
                slider.init()
            }
            else if(e.getAttribute("value") == "click"){
                slider.View.tumblers.cloud = "click"
                slider.init() 
            }
            else{
                slider.View.tumblers.cloud = "none"
                slider.init() 
            }
        } 
    })
    panelNode.find("[name='orient']").each((i, e)=>{
        e.onchange = (event)=>{
            let width = panelNode.next().width()
            let height = panelNode.next().height()
            if(e.getAttribute("value") == "vertical"){
                slider.View.orient = "vertical"
                slider.View.line.orient = "vertical"
                slider.View.selected.orient = "vertical"
                slider.View.scale.orient = "vertical"
                slider.View.tumblers.orient = "vertical"
                panelNode.next().height(width)
                panelNode.next().width(height)
                slider.init()
            }
            else{
                slider.View.orient = "horizontal"
                slider.View.line.orient = "horizontal"
                slider.View.selected.orient = "horizontal"
                slider.View.scale.orient = "horizontal"
                slider.View.tumblers.orient = "horizontal"
                panelNode.next().height(width)
                panelNode.next().width(height)
                slider.init() 
            }
        }  
    })

    panelNode.find("input[name='origin']").on("change", (e)=>{
        e.preventDefault()
        let value = Number((e.target as HTMLInputElement).value)
        slider.Model.origin = value
        slider.View.scale.origin = value
        slider.init()
    })
    panelNode.find("input[name='origin']").on("submit", (e)=>{
        e.preventDefault()
    })

    panelNode.find("input[name='range']").on("change", (e)=>{
        e.preventDefault()
        let value = Math.max(Number((e.target as HTMLInputElement).value), 1);
        (e.target as HTMLInputElement).value = value.toString()
        slider.Model.range = value
        slider.View.scale.range = value
        slider.init()
    })
    panelNode.find("input[name='range']").on("submit", (e)=>{
        e.preventDefault()
    })
    panelNode.find("input[name='interval']").on("change", (e)=>{
        e.preventDefault()
        let value = Math.max(Number((e.target as HTMLInputElement).value), 1);
        (e.target as HTMLInputElement).value = value.toString()
        slider.View.scale.interval = value
        slider.init()
    })
    panelNode.find("input[name='interval']").on("submit", (e)=>{
        e.preventDefault()
    })

    panelNode.find("input[name='list']").on("change", (e)=>{
        e.preventDefault()
        let value = (e.target as HTMLInputElement).value.split(",")
        slider.Model.range = value.length-1
        slider.View.scale.range = value.length-1
        slider.View.scale.list = value
        slider.init()
        panelNode.find("input[name='range']").prop("value", slider.Model.range)
        
    })
    panelNode.find("input[name='list']").on("submit", (e)=>{
        e.preventDefault()
    })
    panelNode.find("input[name='step']").on("change", (e)=>{
        e.preventDefault()
        let value = Math.max(Number((e.target as HTMLInputElement).value), 1);
        (e.target as HTMLInputElement).value = value.toString()
        slider.Model.step = value
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
        slider.Model.type == "point" ?
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





