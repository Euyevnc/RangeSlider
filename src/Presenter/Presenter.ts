class Presenter implements PresenterI {
  view: ViewI;

  model: ModelI;

  constructor(view:ViewI, model:ModelI) {
    this.view = view;
    this.model = model;
  }

  reactToInteraction(data: { startPos: number, endPos: number, method: string }) {
    this.model.updateConfig(data);
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
