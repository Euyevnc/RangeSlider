class Observer implements ObserverType {
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

  broadcast = (...args: Array<any>) => {
    this.observers.forEach((subscriber) => subscriber(...args));
  };
}

export default Observer;
