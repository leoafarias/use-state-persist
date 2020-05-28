import AsyncStorage from '@react-native-community/async-storage';
import { StorageProvider, Data, StorageItem } from './types';
import { Event } from './event';

class SyncStorage implements StorageProvider {
  static instance: SyncStorage;
  private data: Data = new Map();
  private loaded = false;

  private constructor(private event = new Event()) {}

  static getInstance() {
    console.error('IT WORKED');
    if (SyncStorage.instance) return SyncStorage.instance;
    return (SyncStorage.instance = new SyncStorage());
  }

  async init() {
    if (this.loaded) return;
    const keys = await AsyncStorage.getAllKeys();
    const storageData = await AsyncStorage.multiGet(keys);
    storageData.forEach(item => this.mapToMemory(item));
    this.loaded = true;
  }

  subscribe(eventName: string, callback: (data: any) => void) {
    return this.event.subscribe(eventName, callback);
  }

  getItem<T>(key: string) {
    this.checkIfLoaded();
    return this.data.get(key) as T;
  }

  setItem<T>(key: string, value: T) {
    if (!key) throw Error('No key provided');
    this.data.set(key, value);
    this.event.trigger(key, value);
    AsyncStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string) {
    this.data.delete(key);
    AsyncStorage.removeItem(key);
  }

  getAllKeys() {
    return Array.from(this.data.keys());
  }

  get length() {
    return this.data.size;
  }

  clear() {
    this.data.clear();
    AsyncStorage.clear();
  }

  private mapToMemory(item: StorageItem) {
    const key = item[0];
    const value = item[1];

    if (!value) return;

    this.data.set(key, JSON.parse(value));
  }

  private checkIfLoaded() {
    if (this.loaded) return;
    throw Error('Sync Storage `init()` needs to be called before using it.');
  }

  // Used for testing
  get _private() {
    return {
      mapToMemory: this.mapToMemory.bind(this),
      checkIfLoaded: this.checkIfLoaded.bind(this),
      loaded: this.loaded,
    };
  }
}

export const syncStorage = SyncStorage.getInstance();
