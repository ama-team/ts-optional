import {IOptional} from './IOptional';

export interface IPipeline<I, O> {
    map<V>(operation: (identity: O) => V | null): IPipeline<I, V>;
    flatMap<V>(operation: (identity: O) => IOptional<V>): IPipeline<I, V>;
    filter(predicate: (identity: O) => boolean): IPipeline<I, O>;
    append<V>(pipeline: IPipeline<O, V>): IPipeline<I, V>;
    apply(input: I): IOptional<O>;
}
