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
    config: ConfigI;

    model: ModelI;
    view:ViewI;
    presenter:PresenterI;

    init: Function;
    getValue: Function;
    setValue: Function;
}
interface ConfigI{
    type: string;
    orient: string;
    list: Array<number|string>;
    range: number;
    origin:number;
    step: number;
    scale: boolean;
    scaleInterval: number;
    cloud: string;
    value: Array<number>;
}
interface ModelI{
    config: ConfigI;
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
    config: ConfigI;

    tumblers: Object;
    line: Object;
    selected: Object;
    scale: Object;
    callback: Function;
    render: Function;
    updateView: Function;
}


