import Observer from '../Observer/Observer';
import { DRAG, TEPPEING, SCALE_CLICK } from '../consts';

class Presenter implements PresenterType {
  #view: ViewType;

  #model: ModelType;

  #valueUpdateObserver;

  constructor(view:ViewType, model:ModelType) {
    this.#view = view;
    this.#model = model;
    this.#valueUpdateObserver = new Observer();
    this.#connectLayers();
  }

  #reactToInteraction = (method: string, data: DataForModel) => {
    switch (method) {
      case DRAG:
        this.#model.updateFromPercent(data);
        break;
      case SCALE_CLICK:
        this.#model.updateDirectly(data);
        break;
      case TEPPEING:
        this.#model.updateFromStep(data);
        break;
      default:
        break;
    }
  };

  #reactToUpdate = (data: DataForView) => {
    this.#view.updateView(data);
    this.#valueUpdateObserver.broadcast();
  };

  #connectLayers = () => {
    this.#model.observer.subscribe(this.#reactToUpdate.bind(this));
    this.#view.observer.subscribe(this.#reactToInteraction.bind(this));
  };

  addCallback = (f: () => void) => {
    this.#valueUpdateObserver.subscribe(f);
  };

  removeCallback = (f: () => void) => {
    this.#valueUpdateObserver.unsubscribe(f);
  };
}

export default Presenter;
