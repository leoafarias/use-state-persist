class BaseEvent<D, R> {
  private currentIndex: { [eventName: string]: number } = {};
  private handlerMap: {
    [eventName: string]: { [key: number]: (data: D) => R };
  } = {};

  protected add(eventName: string, callback: (data: D) => R): number {
    if (!callback) {
      throw new Error('No callback specified.');
    }
    const eventHandlers = this.handlerMap[eventName]
      ? this.handlerMap[eventName]
      : {};
    const currentIndex = this.currentIndex[eventName]
      ? this.currentIndex[eventName]
      : 0;

    try {
      eventHandlers[currentIndex] = callback;
      this.handlerMap[eventName] = eventHandlers;
      return currentIndex;
    } finally {
      this.currentIndex[eventName] = currentIndex + 1;
    }
  }

  protected remove(eventName: string, handler: number): void {
    if (this.handlerMap[eventName][handler]) {
      delete this.handlerMap[eventName][handler];
    }
  }

  protected getCallbacks(eventName: string): ((data: D) => R)[] {
    const callbacks: ((data: D) => R)[] = [];
    const eventHandlers = this.handlerMap[eventName];
    for (const key in eventHandlers) {
      if (eventHandlers[key]) {
        callbacks.push(eventHandlers[key]);
      }
    }

    return callbacks;
  }

  protected fireCallbacks(
    eventName: string,
    data: D,
    defaultValueOfCallback: R | undefined = undefined
  ): R | undefined {
    let hadCallbacks = false;
    const handlers = this.handlerMap[eventName];

    for (const key in handlers) {
      if (handlers[key]) {
        hadCallbacks = true;

        const result = handlers[key](data);
        if (result) {
          return result;
        }
      }
    }
    return hadCallbacks ? defaultValueOfCallback : undefined;
  }
}

export interface EventInterface<D> {
  subscribe(eventName: string, callback: (data: D) => void): () => void;
  trigger(eventName: string, data: D): void;
}
export class Event<D> extends BaseEvent<D, void> implements EventInterface<D> {
  subscribe(eventName: string, callback: (data: D) => void): () => void {
    const handle = super.add(eventName, callback);
    return () => super.remove(eventName, handle);
  }
  trigger = (eventName: string, data: D): void =>
    super.fireCallbacks(eventName, data);
}
