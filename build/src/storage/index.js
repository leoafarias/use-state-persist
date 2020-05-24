"use strict";
/// <reference lib="dom"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncStorage = void 0;
exports.syncStorage = {
    // Async function for compat with AsyncStorage
    init: async () => { },
    getItem: (key) => {
        return localStorage.getItem(key);
    },
    setItem(key, value) {
        localStorage.setItem(key, value);
    },
    removeItem(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    },
};
//# sourceMappingURL=index.js.map