type Value<T> = T | undefined;
type ReturnValues<T> = [Value<T>, (value: T) => void, boolean];
