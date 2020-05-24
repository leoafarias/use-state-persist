"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStatePersist = void 0;
const react_1 = require("react");
const storage_1 = require("./storage");
exports.useStatePersist = (key, value) => {
    const [state, setState] = react_1.useState(value);
    const [isStale, setIsStale] = react_1.useState(true);
    react_1.useEffect(() => {
        loadInitialState();
    }, []);
    const loadInitialState = async () => {
        await storage_1.syncStorage.init();
        setIsStale(value === undefined);
        const payload = storage_1.syncStorage.getItem(key);
        if (!payload) {
            setState(undefined);
            return;
        }
        const data = JSON.parse(payload);
        setState(data);
    };
    const setNewState = react_1.useCallback(async (value) => {
        const currentState = JSON.stringify(state);
        const newState = JSON.stringify(value);
        if (currentState !== newState) {
            setState(value);
            setIsStale(false);
            storage_1.syncStorage.setItem(key, newState);
        }
    }, [setState]);
    return [state, setNewState, isStale];
};
//# sourceMappingURL=use-state-persist.js.map