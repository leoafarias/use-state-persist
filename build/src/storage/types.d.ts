declare type Key = string;
declare type StorageItem = [Key, string | null];
declare type Data = Map<string, any>;
interface StorageProvider {
    init(): Promise<void>;
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
}
