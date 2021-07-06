import Observer from '../Observer/Observer';
import { DRAG, TEPPEING, SCALE_CLICK } from '../consts';

class Presenter implements PresenterType {
  private view: ViewType;

  private model: ModelType;

  private valueUpdateObserver;

  public constructor(view:ViewType, model:ModelType) {
    this.valueUpdateObserver = new Observer();

    this.view = view;
    this.model = model;
    this.connectLayers();
    this.model.updateDirectly({});
  }

  private reactToInteraction = (method: string, data: DataForModel) => {
    switch (method) {
      case DRAG:
        this.model.updateFromPercent(data);
        break;
      case SCALE_CLICK:
        this.model.updateFromPercent(data);
        break;
      case TEPPEING:
        this.model.updateFromStep(data);
        break;
      default:
        break;
    }
  };

  private reactToUpdate = (data: DataForView) => {
    this.view.updateView(data);
    this.valueUpdateObserver.broadcast(data);
  };

  private connectLayers = () => {
    this.model.observer.subscribe(this.reactToUpdate.bind(this));
    this.view.observer.subscribe(this.reactToInteraction.bind(this));
  };

  public addValueUpdateCallback = (f: (data: DataForView) => void) => {
    this.valueUpdateObserver.subscribe(f);
  };

  public removeValueUpdateCallback = (f: (data: DataForView) => void) => {
    this.valueUpdateObserver.unsubscribe(f);
  };
}

export default Presenter;
