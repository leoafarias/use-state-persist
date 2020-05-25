export type Key = string;
export type StorageItem = [Key, string | null];
export type Data = Map<string, any>;
export interface StorageProvider {
  ready(): Promise<void>;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}
