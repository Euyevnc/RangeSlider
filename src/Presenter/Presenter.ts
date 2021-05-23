import { SCALE_CLICK, DRAG, TEPPEING } from './../consts';
class Presenter implements PresenterI {
  view: ViewI;

  model: ModelI;

  constructor(view:ViewI, model:ModelI) {
    this.view = view;
    this.model = model;
    this.connectLayers()
  }

  reactToInteraction(method: string, data: DataToTransfer) {
    switch(method) {
      case SCALE_CLICK: 
        this.model.updateDirectively(data)
        break
      case DRAG:
        this.model.updateFromPercent(data)
        break
      case TEPPEING:
        this.model.updateFromStep(data)
        break
    }
      
  }

  reactToUpdate(data: ({ firCoor: number, secCoor: number })) {
    this.view.updateView(data);
  }

  connectLayers() {
    this.model.observer.subscribe(this.reactToUpdate.bind(this));
    this.view.observer.subscribe(this.reactToInteraction.bind(this));
  }
}

export default Presenter;
