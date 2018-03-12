import {IOptional} from './IOptional';
import {IPipeline} from './IPipeline';
import {Optional} from './Optional';

type IOptionalOperation<T, V> = (input: IOptional<T>) => IOptional<V>;

export class Pipeline<I, O> implements IPipeline<I, O> {
    public static create<T>(): Pipeline<T, T> {
        return new Pipeline<T, T>();
    }

    private operations: Array<IOptionalOperation<any, any>>;

    protected constructor(...operations: Array<IOptionalOperation<any, any>>) {
        this.operations = operations;
    }

    public map<V>(operation: (identity: O) => V | null): IPipeline<I, V> {
        return new Pipeline(...this.operations, (optional) => optional.map(operation));
    }

    public flatMap<V>(operation: (identity: O) => IOptional<V>): IPipeline<I, V> {
        return new Pipeline(...this.operations, (optional) => optional.flatMap(operation));
    }

    public filter(predicate: (identity: O) => boolean): IPipeline<I, O> {
        return new Pipeline(...this.operations, (optional) => optional.filter(predicate));
    }

    public apply(input: I): IOptional<O> {
        const reducer = (state: IOptional<any>, operation: IOptionalOperation<any, any>) => operation(state);
        return this
            .operations
            .reduce(reducer, Optional.ofNullable(input));
    }

    public append<V>(pipeline: IPipeline<O, V>): IPipeline<I, V> {
        return new Pipeline(...this.operations, (optional) => optional.flatMap(pipeline.apply));
    }
}
