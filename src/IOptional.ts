export interface IOptional<T> {
    present: boolean;
    empty: boolean;

    map<V>(operation: (identity: T) => V | null): IOptional<V>;
    flatMap<V>(operation: (identity: T) => IOptional<V>): IOptional<V>;
    filter(predicate: (identity: T) => boolean): IOptional<T>;

    ifPresent(consumer: (identity: T) => void): IOptional<T>;
    ifEmpty(action: () => void): IOptional<T>;
    peek(consumer: (identity: T | null) => void): IOptional<T>;
    on(present: (identity: T) => void, empty: () => void): IOptional<T>;

    rescue(value: T): IOptional<T>;
    rescueWith(producer: () => T): IOptional<T>;

    get(): T;
    orElse(fallback: T | null): T | null;
    orElseGet(producer: () => T | null): T | null;
    orElseThrow<E>(producer: () => E): T;
}
