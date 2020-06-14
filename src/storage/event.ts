export class BaseEvent<D, R> {
  private handlerMap: { [key: number]: (data: D) => R } = {};
  private currentIndex = 0;

  protected add(callback: (data: D) => R): number {
    if (!callback) {
      throw new Error('No callback specified.');
    }

    try {
      this.handlerMap[this.currentIndex] = callback;
      return this.currentIndex;
    } finally {
      this.currentIndex++;
    }
  }

  protected remove(handler: number): void {
    if (this.handlerMap[handler]) {
      delete this.handlerMap[handler];
    }
  }

  protected removeAll(): void {
    this.handlerMap = {};
  }

  protected getCallbacks(): ((data: D) => R)[] {
    const callbacks: ((data: D) => R)[] = [];

    for (const key in this.handlerMap) {
      if (this.handlerMap[key]) {
        callbacks.push(this.handlerMap[key]);
      }
    }

    return callbacks;
  }

  protected getResult(
    data: D,
    defaultValueOfCallback: R | undefined = undefined
  ): R | undefined {
    let hadCallbacks = false;
    for (const key in this.handlerMap) {
      if (this.handlerMap[key]) {
        hadCallbacks = true;
        const result = this.handlerMap[key](data);
        if (result) {
          return result;
        }
      }
    }
    return hadCallbacks ? defaultValueOfCallback : undefined;
  }
}

export interface DataEvent<D> {
  on(callback: (data: D) => void): () => void;

  trigger(data: D): void;
}

export class Event<D> extends BaseEvent<D, void> implements DataEvent<D> {
  on = (callback: (data: D) => void): (() => void) => {
    const handle = super.add(callback);
    return () => super.remove(handle);
  };

  trigger = (data: D): void => super.getResult(data);
}
