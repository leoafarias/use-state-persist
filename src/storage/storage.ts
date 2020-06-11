/// <reference lib="dom"/>
import { StorageProvider, StorageEvents } from './types';
import { Event } from './event';

class SyncStorage implements StorageProvider {
  static instance: SyncStorage;

  private constructor(private events: StorageEvents = {}) {}

  static getInstance() {
    if (SyncStorage.instance) return SyncStorage.instance;
    return (SyncStorage.instance = new SyncStorage());
  }

  // API Compatibility with native
  static loaded = true;
  async init() {}

  subscribe(key: string, callback: (data: any) => void) {
    return this.getEvent(key).on(callback);
  }

  getItem<T>(key: string) {
    const value = localStorage.getItem(key);
    if (!value) return;

    let data = value;
    try {
      data = JSON.parse(value);
    } catch (err) {
      data = value;
    }

    return (data as unknown) as T;
  }

  setItem<T>(key: string, value: T) {
    if (!key) throw Error('No key provided');
    this.getEvent(key).trigger(value);
    localStorage.setItem(key, JSON.stringify(value));
  }

  getEvent(key: string) {
    if (this.events[key]) {
      return this.events[key];
    }
    return (this.events[key] = new Event());
  }

  getAllKeys() {
    return Object.keys(localStorage);
  }

  removeItem(key: string) {
    this.getEvent(key).trigger(undefined);
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
