declare class SyncStorage implements Storage {
    static instance: SyncStorage;
    private data;
    static loaded: boolean;
    private constructor();
    static getInstance(): SyncStorage;
    init(): Promise<void>;
    getItem<T>(key: string): T;
    setItem<T>(key: string, value: T): void;
    removeItem(key: string): void;
    getAllKeys(): string[];
    key(index: number): string | null;
    get length(): number;
    clear(): void;
    private mapToMemory;
    checkIfLoaded(): void;
}
export declare const syncStorage: SyncStorage;
export {};
