/// <reference lib="dom"/>
import { StorageProvider } from './types';
import { Event } from './event';

class SyncStorage implements StorageProvider {
  static instance: SyncStorage;

  private constructor(private event = new Event()) {}

  static getInstance() {
    if (SyncStorage.instance) return SyncStorage.instance;
    return (SyncStorage.instance = new SyncStorage());
  }

  // API Compatibility with native
  static loaded = true;
  async init() {}

  get subscribe() {
    return this.event.subscribe;
  }

  getItem<T>(key: string) {
    const value = localStorage.getItem(key);
    if (!value) return;
    return JSON.parse(value) as T;
  }

  setItem<T>(key: string, value: T) {
    if (!key) throw Error('No key provided');
    localStorage.setItem(key, JSON.stringify(value));
    this.event.trigger(value);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  get length() {
    return localStorage.length;
  }

  clear() {
    localStorage.clear();
  }
}

export const syncStorage = SyncStorage.getInstance();
