interface sliderObjectI{
    config: ConfigI;

    model: ModelI;
    view:ViewI;
    presenter:PresenterI;

    init: Function;
    getValue: Function;
    setValue: Function;
    adaptValues: Function;

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
    observer: ObserverI;
    updateConfig: Function;
    adaptValues: Function;
}

interface PresenterI{
    view: ViewI;
    model: ModelI;

    reactToInteraction: Function;
    reactToUpdate: Function;

    connectLayers: Function;
}

interface ViewI{
    root:HTMLElement;
    element: HTMLElement;
    config: ConfigI;
    observer: ObserverI;

    tumblers: Object;
    line: Object;
    selected: Object;
    scale: Object;
    callback: Function;
    render: Function;
    updateView: Function;
}

interface ObserverI{
    observers: Array<Function>;
    subscribe: Function;
    unsubscribe: Function;
    broadcast: Function;
}
interface JQuery
{
    rangeSlider: Function;
}

interface JQueryStatic
{
    rangeSlider: Function;
} 


