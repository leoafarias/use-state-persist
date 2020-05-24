type Value<T> = T | undefined;
type ReturnValues<T> = [Value<T>, (value: T) => void, boolean];

interface StorageProvider {
  getItem(key: string): any;
  setItem(key: string, value: any): void;
}
