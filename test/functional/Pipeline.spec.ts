import {Optional, Pipeline} from '../../src';
import * as Sinon from 'sinon';
import {expect} from 'chai'

describe('/Pipeline.ts', () => {
    describe('.Pipeline', () => {
        describe('#map()', () => {
            it('adds transformer to queue', () => {
                const transformer = (i: number) => i * 2;
                const value = 12;
                const expectation = transformer(value);
                const spy = Sinon.spy(transformer);
                const pipeline = Pipeline.create<number>().map(spy);
                expect(spy.callCount).to.eq(0);
                expect(pipeline.transform(value)).to.eq(expectation);
                expect(spy.callCount).to.eq(1);
            });
        });

        describe('#flatMap', () => {
            it('adds transformer to queue', () => {
                const transformer = (i: number) => Optional.of(i * 2);
                const value = 12;
                const expectation = transformer(value).get();
                const spy = Sinon.spy(transformer);
                const pipeline = Pipeline.create<number>().flatMap(spy);
                expect(spy.callCount).to.eq(0);
                expect(pipeline.transform(value)).to.eq(expectation);
                expect(spy.callCount).to.eq(1);
            });
        });

        describe('#filter()', () => {
            it('adds filter to queue and prevents value from passing', () => {
                const filter = Sinon.stub().returns(false);
                const pipeline = Pipeline.create<number>().filter(filter);
                expect(filter.callCount).to.eq(0);
                expect(pipeline.transform(12)).to.eq(null);
                expect(filter.callCount).to.eq(1);
            });

            it('adds filter to queue and allows value to pass', () => {
                const filter = Sinon.stub().returns(true);
                const pipeline = Pipeline.create<number>().filter(filter);
                const value = 12;
                expect(filter.callCount).to.eq(0);
                expect(pipeline.transform(value)).to.eq(value);
                expect(filter.callCount).to.eq(1);
            });
        });

        describe('#append()', () => {
            it('produces compound pipeline', function () {
                const alphaTransformer = (i: number) => i * 2;
                const alphaSpy = Sinon.spy(alphaTransformer);
                const alpha = Pipeline.create<number>().map(alphaSpy);
                const betaTransformer = (i: number) => i / 2;
                const betaSpy = Sinon.spy(betaTransformer);
                const beta = Pipeline.create<number>().map(betaSpy);
                const gamma = alpha.append(beta);

                // validating that append created new pipeline without
                // affecting concatenated pipelines

                expect(alphaSpy.callCount).to.eq(0);
                expect(alpha.transform(12)).to.eq(24);
                expect(alphaSpy.callCount).to.eq(1);
                
                expect(betaSpy.callCount).to.eq(0);
                expect(beta.transform(12)).to.eq(6);
                expect(betaSpy.callCount).to.eq(1);

                expect(gamma.transform(12)).to.eq(12);
                expect(alphaSpy.callCount).to.eq(2);
                expect(betaSpy.callCount).to.eq(2);
            });
        });
    });
});
