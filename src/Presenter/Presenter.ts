import { DRAG, STRIDE, SCALE_CLICK } from '../consts';

class Presenter {
  private view: ViewType;

  private model: ModelType;

  public constructor(view: ViewType, model: ModelType) {
    this.view = view;
    this.model = model;
    this.connectLayers();
  }

  private reactToInteraction: CallbackForView =
  (method: typeof DRAG | typeof SCALE_CLICK | typeof STRIDE, data: DataForModel) => {
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

  private reactToUpdate: CallbackForModel = (data: DataForView) => {
    this.view.updateView(data);
  };

  private connectLayers = () => {
    this.model.observer.subscribe(this.reactToUpdate.bind(this));
    this.view.observer.subscribe(this.reactToInteraction.bind(this));
  };
}

export default Presenter;
