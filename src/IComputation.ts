import {IOptional} from './IOptional';

export interface IComputation<I, O> {
    map<V>(operation: (identity: O) => V): IComputation<I, V>;
    flatMap<V>(operation: (identity: O) => IOptional<V>): IComputation<I, V>;
    filter(predicate: (identity: O) => boolean): IComputation<I, O>;
    append<V>(computation: IComputation<O, V>): IComputation<I, V>;
    apply(identity: I | null): O | null;
}
