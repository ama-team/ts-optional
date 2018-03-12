import {IComputation} from './IComputation';
import {IOptional} from './IOptional';
import {IPipeline} from './IPipeline';
import {Pipeline} from './Pipeline';

export class Computation<I, O> implements IComputation<I, O> {
    public static create<T>(): Computation<T, T> {
        return new Computation<T, T>(Pipeline.create());
    }

    private pipeline: IPipeline<I, O>;

    protected constructor(pipeline: IPipeline<I, O>) {
        this.pipeline = pipeline;
    }

    public map<V>(operation: (identity: O) => V): IComputation<I, V> {
        return new Computation(this.pipeline.map(operation));
    }

    public flatMap<V>(operation: (identity: O) => IOptional<V>): IComputation<I, V> {
        return new Computation(this.pipeline.flatMap(operation));
    }

    public filter(predicate: (identity: O) => boolean): IComputation<I, O> {
        return new Computation(this.pipeline.filter(predicate));
    }

    public append<V>(computation: IComputation<O, V>): Computation<I, V> {
        const operation = (identity: O) => computation.apply(identity);
        return new Computation<I, V>(this.pipeline.map(operation));
    }

    public apply(identity: I): O | null {
        return this.pipeline.apply(identity).orElse(null);
    }
}
