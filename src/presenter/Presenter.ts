import Observer from '../observer';
import { DRAG, STRIDE, SCALE_CLICK } from '../consts';

class Presenter implements RangeSliderPresenter {
  private view: RangeSliderView;

  private model: RangeSliderModel;

  public modelObserver: RangeSliderObserver;

  public constructor(view: RangeSliderView, model: RangeSliderModel) {
    this.view = view;
    this.model = model;
    this.modelObserver = new Observer();
    this.modelObserver.subscribe(this.view.updateView);
    this.connectLayers();
  }

  private reactToInteraction: RangeSliderViewCallback = (method, data) => {
    switch (method) {
      case DRAG:
        this.model.updateFromPercent(data);
        break;
      case SCALE_CLICK:
        this.model.updateFromPercent(data);
        break;
      case STRIDE:
        this.model.updateFromStride(data);
        break;
      default:
        break;
    }
  };

  private reactToUpdate: RangeSliderModelCallback = (data: RangeSliderViewData) => {
    this.modelObserver.broadcast(data);
  };

  private connectLayers = () => {
    this.model.observer.subscribe(this.reactToUpdate);
    this.view.observer.subscribe(this.reactToInteraction);
  };

  public addValuesUpdateListener(f:(data: RangeSliderViewData) => void) {
    this.modelObserver.subscribe(f);
  }

  public removeValuesUpdateListener(f:(data: RangeSliderViewData) => void) {
    this.modelObserver.unsubscribe(f);
  }
}

export default Presenter;
