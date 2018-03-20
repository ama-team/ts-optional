import {IOptional} from './IOptional';

export class Optional<T> implements IOptional<T> {
    public static empty<T>(): Optional<T> {
        return new Optional<T>(null);
    }

    public static ofNullable<T>(identity: T | null): Optional<T> {
        return new Optional<T>(this.exists(identity) ? identity : null);
    }

    public static of<T>(identity: T): Optional<T> {
        if (!this.exists(identity)) {
            throw new TypeError('Provided value is invalid');
        }
        return new Optional<T>(identity);
    }

    public static exists<T>(identity: T | null | undefined): boolean {
        return identity !== null && typeof identity !== 'undefined';
    }

    private identity: T | null;

    protected constructor(identity: T | null) {
        this.identity = identity;
    }

    public get empty(): boolean {
        return this.identity === null;
    }

    public get present() {
        return this.identity !== null;
    }

    public map<V>(operation: (identity: T) => V | null): Optional<V> {
        return new Optional(this.identity !== null ? operation(this.identity) : null);
    }

    public flatMap<V>(transformer: (identity: T) => IOptional<V>): Optional<V> {
        const product = this.identity !== null ? transformer(this.identity).orElse(null) : null;
        return Optional.ofNullable(product);
    }

    public filter(predicate: (identity: T) => boolean): Optional<T> {
        const product = this.identity !== null && predicate(this.identity) ? this.identity : null;
        return new Optional(product);
    }

    public ifPresent(consumer: (identity: T) => void): Optional<T> {
        if (this.identity !== null) {
            consumer(this.identity);
        }
        return this;
    }

    public ifEmpty(action: () => void): IOptional<T> {
        if (this.identity === null) {
            action();
        }
        return this as IOptional<T>;
    }

    public peek(consumer: (identity: (T | null)) => void): Optional<T> {
        consumer(this.identity);
        return this;
    }

    public on(present: (identity: T) => void, empty: () => void): Optional<T> {
        if (this.identity === null) {
            empty();
        } else {
            present(this.identity);
        }
        return this;
    }

    public get(): T {
        if (this.identity === null) {
            throw new TypeError('Provided value is invalid');
        }
        return this.identity;
    }

    public orElse(fallback: T): T {
        return this.identity === null ? fallback : this.identity;
    }

    public orElseGet(producer: () => T): T {
        return this.identity === null ? producer() : this.identity;
    }

    public orElseThrow<E>(producer: () => E): T {
        if (this.identity !== null) {
            return this.identity;
        }
        throw producer();
    }
}
