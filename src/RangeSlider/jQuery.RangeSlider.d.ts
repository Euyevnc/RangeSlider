interface JQuery
{
    RangeSlider: Function;
}

interface JQueryStatic
{
    RangeSlider: Function;
} 
interface sliderObjectI
{
    root: HTMLElement;
    config: sliderConfigI;

    Model: ModelI;
    View:ViewI;
    Presenter:PresenterI;

    init: Function;
    getValue: Function;
    setValue: Function;
}
interface sliderConfigI{
    type: string;
    orient: string;
    list: Array<number|string>;
    _start: number;
    _end: number;
    start: number;
    end: number;
    range: number;
    origin:number;
    step: number;
    scale: boolean;
    scaleInterval: number;
    cloud: string;
    value: Array<number>;

}
interface ModelI{
    config: sliderConfigI;
    updateConfig: Function;
    callback:Function;
}

interface PresenterI{
    callback_shiftReact: Function;
    callback_updateReact: Function;
    OptionalCallback_shiftReact: Function;
    OptionalCallback_updateReact: Function;
    shiftReact: Function;
    updateReact: Function;
}

interface ViewI{
    root:HTMLElement;
    element: HTMLElement;
    config: sliderConfigI;

    tumblers: Object;
    line: Object;
    selected: Object;
    scale: Object;
    callback: Function;
    render: Function;
    updateView: Function;
}


