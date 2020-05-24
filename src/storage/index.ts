/// <reference lib="dom"/>

export const syncStorage: StorageProvider = {
  // Async function for compat with AsyncStorage
  init: async () => {},
  getItem: (key: string) => {
    return localStorage.getItem(key);
  },

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  },

  removeItem(key: string) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};
