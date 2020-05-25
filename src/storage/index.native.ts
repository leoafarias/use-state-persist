import AsyncStorage from '@react-native-community/async-storage';
import { StorageProvider, Data, StorageItem } from './types';

class SyncStorage implements StorageProvider {
  static instance: SyncStorage;
  private data: Data = new Map();
  static loaded = false;

  private constructor() {}

  static getInstance() {
    if (SyncStorage.instance) return SyncStorage.instance;
    return (SyncStorage.instance = new SyncStorage());
  }

  async ready() {
    if (SyncStorage.loaded) return;
    const keys = await AsyncStorage.getAllKeys();
    const storageData = await AsyncStorage.multiGet(keys);
    storageData.forEach(item => this.mapToMemory(item));
    SyncStorage.loaded = true;
  }

  getItem<T>(key: string) {
    this.checkIfLoaded();
    return this.data.get(key) as T;
  }

  setItem<T>(key: string, value: T) {
    if (!key) throw Error('No key provided');
    this.data.set(key, value);
    AsyncStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string) {
    this.data.delete(key);
    AsyncStorage.removeItem(key);
  }

  getAllKeys() {
    return Array.from(this.data.keys());
  }

  clear() {
    this.data.clear();
    AsyncStorage.clear();
  }

  private mapToMemory(item: StorageItem) {
    const key = item[0];
    let value = item[1] ?? null;

    try {
      if (value) value = JSON.parse(value);
    } catch (e) {
      [, value] = item;
    }

    this.data.set(key, value);
  }

  checkIfLoaded() {
    if (SyncStorage.loaded) return;
    throw Error('Sync Storage `init()` needs to be called before using it.');
  }
}

export const syncStorage = SyncStorage.getInstance();
