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

    model: ModelI;
    view:ViewI;
    presenter:PresenterI;

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
    view: ViewI;
    model: ModelI;

    reactToInteraction: Function;
    reactToUpdate: Function;

    OptionalReactToInteraction: Function;
    OptionalReactToUpdate: Function;

    connectLayers: Function;
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


