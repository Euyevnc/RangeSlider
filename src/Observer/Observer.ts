class Observer implements ObserverI {
  observers: Array<Function>;

  constructor() {
    this.observers = [];
  }

  subscribe = (fn: Function) => {
    this.observers.push(fn);
  };

  unsubscribe = (fn: Function) => {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  };

  broadcast = (data: Object) => {
    this.observers.forEach((subscriber) => subscriber(data));
  };
}

export default Observer;
