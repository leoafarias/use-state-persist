class BaseEvent<D, R> {
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

export interface EventInterface {
  on(callback: () => void): number;
  off(handle: number): void;
  trigger(): void;
}

export class Event extends BaseEvent<void, void> implements EventInterface {
  on = (callback: () => void): number => super.add(callback);
  off = (handler: number): void => super.remove(handler);
  trigger = (): void => super.getResult(undefined);
}
