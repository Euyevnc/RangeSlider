import { DRAG, TEPPEING, SCALE_CLICK } from '../consts';

class Presenter implements PresenterType {
  view: ViewType;

  model: ModelType;

  constructor(view:ViewType, model:ModelType) {
    this.view = view;
    this.model = model;
    this.connectLayers();
  }

  reactToInteraction(method: string, data: DataForModel) {
    switch (method) {
      case DRAG:
        this.model.updateFromPercent(data);
        break;
      case SCALE_CLICK:
        this.model.updateDirectively(data);
        break;
      case TEPPEING:
        this.model.updateFromStep(data);
        break;
      default:
        break;
    }
  }

  reactToUpdate(data: DataForView) {
    this.view.updateView(data);
  }

  connectLayers() {
    this.model.observer.subscribe(this.reactToUpdate.bind(this));
    this.view.observer.subscribe(this.reactToInteraction.bind(this));
  }
}

export default Presenter;
