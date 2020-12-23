interface JQuery
{
    RangeSlider: Function;
}

interface JQueryStatic
{
    RangeSlider: Function;
} 
interface RangeSliderObject
{
    Model: ModelI;
    View:ViewI;
    Presenter:PresenterI;

    init: Function;
    getValue: Function;
    setValue: Function;
}
interface ModelI{
    range: number;
    origin: number;
    step:number;
    value: Array<number>;
    type: string;
    start: number;
    end:number;
    update: Function;
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
    orient: string;

    tumblers:    {elements:HTMLDivElement[];orient: string; type: string; cloud:string; render: Function; update: Function};
    line:       {element: HTMLElement; orient: string; render: Function}
    selected:   {element: HTMLElement; orient: string; render: Function; update: Function}
    scale:      {element: HTMLElement; display:boolean; list: Array<any>; orient: string; origin: number; range: number; 
                 interval: number; render: Function; update: Function }
    callback: Function;
    render: Function;
    viewUpdate: Function;
}


