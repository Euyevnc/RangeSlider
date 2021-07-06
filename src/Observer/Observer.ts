class Observer implements ObserverType {
  public observers: Array<Function>;

  public constructor() {
    this.observers = [];
  }

  public subscribe = (fn: Function) => {
    this.observers.push(fn);
  };

  public unsubscribe = (fn: Function) => {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  };

  public broadcast = (...args: Array<any>) => {
    this.observers.forEach((subscriber) => subscriber(...args));
  };
}

export default Observer;
