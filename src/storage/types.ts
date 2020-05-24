interface StorageProvider {
  getItem<T = any>(key: string): T;
  setItem<T = any>(key: string, value: T): void;
  removeItem(key: string): void;
  getAllKeys(): string[];
}
