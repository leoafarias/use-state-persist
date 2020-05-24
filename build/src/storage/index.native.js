"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncStorage = void 0;
const async_storage_1 = require("@react-native-community/async-storage");
let SyncStorage = /** @class */ (() => {
    class SyncStorage {
        constructor() {
            this.data = new Map();
        }
        static getInstance() {
            if (SyncStorage.instance)
                return SyncStorage.instance;
            return (SyncStorage.instance = new SyncStorage());
        }
        async init() {
            if (SyncStorage.loaded)
                return;
            const keys = await async_storage_1.default.getAllKeys();
            const storageData = await async_storage_1.default.multiGet(keys);
            storageData.forEach(item => this.mapToMemory(item));
            SyncStorage.loaded = true;
        }
        getItem(key) {
            this.checkIfLoaded();
            return this.data.get(key);
        }
        setItem(key, value) {
            if (!key)
                throw Error('No key provided');
            this.data.set(key, value);
            async_storage_1.default.setItem(key, JSON.stringify(value));
        }
        removeItem(key) {
            this.data.delete(key);
            async_storage_1.default.removeItem(key);
        }
        getAllKeys() {
            return Array.from(this.data.keys());
        }
        key(index) {
            return localStorage.key(index);
        }
        get length() {
            return this.data.size;
        }
        clear() {
            this.data.clear();
            async_storage_1.default.clear();
        }
        mapToMemory(item) {
            var _a;
            const key = item[0];
            let value = (_a = item[1]) !== null && _a !== void 0 ? _a : null;
            try {
                if (value)
                    value = JSON.parse(value);
            }
            catch (e) {
                [, value] = item;
            }
            this.data.set(key, value);
        }
        checkIfLoaded() {
            if (SyncStorage.loaded)
                return;
            throw Error('Sync Storage `init()` needs to be called before using it.');
        }
    }
    SyncStorage.loaded = false;
    return SyncStorage;
})();
exports.syncStorage = SyncStorage.getInstance();
//# sourceMappingURL=index.native.js.map