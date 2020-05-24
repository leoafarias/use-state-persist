type Key = string;

type KeyValue = [Key, string | null];
type Data = Map<string, any>;

interface StorageProvider {
  getItem<T>(key: string): any;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  getAllKeys(): string[];
}

export const syncStorage: StorageProvider;
