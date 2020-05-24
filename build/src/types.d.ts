declare type Value<T> = T | undefined;
declare type ReturnValues<T> = [Value<T>, (value: T) => void, boolean];
