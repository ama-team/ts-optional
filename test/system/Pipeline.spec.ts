import {Optional, Pipeline} from '../../src';
import {expect} from 'chai';

describe('/Pipeline.ts', () => {
    describe('.Pipeline', () => {
        describe('#transform', () => {
            const pipeline = Pipeline
                .create<number>()
                .map(i => i + 1)
                .map(i => i * 2)
                .filter(i => i > 10)
                .flatMap(i => Optional.of(i).map(i => i / 2))
                .map(i => i - 1);
            const variants: Array<[number, number | null]> = [
                [20, 20],
                [0, null],
                [10, 10]
            ];
            variants.forEach(([input, output]) => {
                it('applies complex processing as expected', () => {
                    expect(pipeline.transform(input)).to.eq(output);
                });
            });
        });
    });
});
