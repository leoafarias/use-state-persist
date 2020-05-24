type Key = string;
type StorageItem = [Key, string | null];
type Data = Map<string, any>;
interface StorageProvider {
  init(): Promise<void>;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}
