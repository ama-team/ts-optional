import {Optional} from '../../src';
import {expect} from 'chai';
import * as Sinon from 'sinon';
import {IOptional} from '../../src/IOptional';

describe('/Optional.ts', () => {
    describe('.Optional', () => {
        describe('.of()', () => {
            it('accepts identity', () => {
                expect(Optional.of(false).get()).to.eq(false);
            });

            it('throws on null', () => {
                expect(Optional.of.bind(Optional, null)).to.throw(TypeError);
            });

            it('throws on undefined', () => {
                expect(Optional.of.bind(Optional, undefined)).to.throw(TypeError);
            });
        });

        describe('.ofNullable()', () => {
            it('accepts identity', () => {
                expect(Optional.ofNullable(false).get()).to.eq(false);
            });

            it('accepts null', () => {
                expect(Optional.ofNullable(null).present).to.eq(false);
            });

            it('accepts undefined', () => {
                expect(Optional.ofNullable(undefined).present).to.eq(false);
            });
        });

        describe('.empty()', () => {
            it('returns empty optional', () => {
                expect(Optional.empty().present).to.eq(false);
            });
        });

        describe('#present', () => {
            it('returns true on valid identity', () => {
                expect(Optional.of('').present).to.eq(true);
            });

            it('returns false on missing identity', () => {
                expect(Optional.empty().present).to.eq(false);
            });
        });

        describe('#empty', () => {
            it('returns false on valid identity', () => {
                expect(Optional.of(0).empty).to.eq(false);
            });

            it('returns true on missing identity', () => {
                expect(Optional.empty().empty).to.eq(true);
            });
        });

        describe('#get()', () => {
            it('returns value on valid identity', () => {
                const value: any[] = [];
                expect(Optional.of(value).get()).to.eq(value);
            });

            it('throws on missing identity', () => {
                expect(() => Optional.empty().get()).to.throw(TypeError);
            });
        });

        describe('#orElse()', () => {
            it('returns identity if present', () => {
                const value = 12;
                expect(Optional.of(value).orElse(value * value)).to.eq(value);
            });

            it('returns argument if identity is not present', () => {
                const value = 12;
                expect(Optional.empty().orElse(value)).to.eq(value);
            });
        });

        describe('#orElseGet()', () => {
            it('returns identity if present', () => {
                const producer = Sinon.stub();
                const value = 12;
                expect(Optional.of(value).orElseGet(producer)).to.eq(value);
                expect(producer.callCount).to.eq(0);
            });

            it('calls producer and returns result if identity is missing', () => {
                const value = 12;
                const producer = Sinon.stub().returns(value);
                expect(Optional.empty().orElseGet(producer)).to.eq(value);
                expect(producer.callCount).to.eq(1);
            });
        });

        describe('#orElseThrow()', () => {
            it('returns identity if present', () => {
                const error = new TypeError();
                const producer = Sinon.stub().returns(error);
                const value = 12;
                expect(Optional.of(value).orElseThrow(producer)).to.eq(value);
                expect(producer.callCount).to.eq(0);
            });

            it('calls consumer and throws result if identity is missing', () => {
                const error = new TypeError();
                const producer = Sinon.stub().returns(error);
                expect(() => Optional.empty().orElseThrow(producer)).to.throw(error);
                expect(producer.callCount).to.eq(1);
            });
        });

        describe('#ifEmpty()', () => {
            it('doesn\'t call action if identity is present', () => {
                const action = Sinon.stub();
                Optional.of(12).ifEmpty(action);
                expect(action.callCount).to.eq(0);
            });

            it('calls action if identity is missing', () => {
                const action = Sinon.stub();
                Optional.empty().ifEmpty(action);
                expect(action.callCount).to.eq(1);
            });
        });

        describe('#ifPresent()', () => {
            it('calls consumer if identity is present', () => {
                const value = 12;
                const consumer = Sinon.stub();
                Optional.of(value).ifPresent(consumer);
                expect(consumer.callCount).to.eq(1);
                expect(consumer.getCall(0).args[0]).to.eq(value);
            });

            it('doesn\'t call consumer if identity is missing', () => {
                const consumer = Sinon.stub();
                Optional.empty().ifPresent(consumer);
                expect(consumer.callCount).to.eq(0);
            });
        });

        describe('#peek()', () => {
            it('provides consumer with identity if present', () => {
                const value = 42;
                const consumer = Sinon.stub();
                Optional.of(value).peek(consumer);
                expect(consumer.callCount).to.eq(1);
                expect(consumer.getCall(0).args[0]).to.eq(value);
            });

            it('provides consumer with null if identity is missing', () => {
                const consumer = Sinon.stub();
                Optional.empty().peek(consumer);
                expect(consumer.callCount).to.eq(1);
                expect(consumer.getCall(0).args[0]).to.eq(null);
            });
        });

        describe('#on()', () => {
            it('calls consumer if identity is present', () => {
                const value = 12;
                const consumer = Sinon.stub();
                const action = Sinon.stub();
                Optional.of(value).on(consumer, action);
                expect(consumer.callCount).to.eq(1);
                expect(consumer.getCall(0).args[0]).to.eq(value);
                expect(action.callCount).to.eq(0);
            });

            it('calls action if identity is missing', () => {
                const consumer = Sinon.stub();
                const action = Sinon.stub();
                Optional.empty().on(consumer, action);
                expect(consumer.callCount).to.eq(0);
                expect(action.callCount).to.eq(1);
            });
        });

        describe('#map()', () => {
            it('applies transformer to present identity', () => {
                const identity = 12;
                const result = 42;
                const transformer = Sinon.stub().returns(result);
                const optional = Optional.of(identity).map(transformer);
                expect(transformer.callCount).to.eq(1);
                expect(transformer.getCall(0).args[0]).to.eq(identity);
                expect(optional.get()).to.eq(result);
            });

            it('does nothing if identity is missing', () => {
                const transformer = Sinon.stub();
                Optional.empty().map(transformer);
                expect(transformer.callCount).to.eq(0);
            });
        });

        describe('#flatMap', () => {
            it('applies transformer to present identity', () => {
                const identity = 12;
                const result = 42;
                const transformer = Sinon.stub().returns(Optional.of(result));
                const optional = Optional.of(identity).flatMap(transformer);
                expect(transformer.callCount).to.eq(1);
                expect(transformer.getCall(0).args[0]).to.eq(identity);
                expect(optional.get()).to.eq(result);
            });

            it('does nothing if identity is missing', () => {
                const transformer = Sinon.stub();
                Optional.empty().flatMap(transformer);
                expect(transformer.callCount).to.eq(0);
            });
        });

        describe('#filter', () => {
            it('doesn\'t apply filter to missing identity', () => {
                const filter = Sinon.stub();
                Optional.empty().filter(filter);
                expect(filter.callCount).to.eq(0);
            });

            it('nullifies identity if filter returns false', () => {
                const filter = Sinon.stub().returns(false);
                expect(Optional.of(12).filter(filter).empty).to.eq(true);
                expect(filter.callCount).to.eq(1);
            });

            it('keeps identity if filter returns true', () => {
                const identity = 12;
                const filter = Sinon.stub().returns(true);
                expect(Optional.of(identity).filter(filter).get()).to.eq(identity);
                expect(filter.callCount).to.eq(1);
            });
        });

        describe('#equals()', () => {
            it('returns true for same optional', () => {
                const optional = Optional.empty();
                expect(optional.equals(optional)).to.eq(true);
            });

            it('returns true for two empty optionals', () => {
                const other = {empty: true} as IOptional<any>;
                expect(Optional.empty().equals(other)).to.eq(true);
            });

            it('returns true for optionals with same content', () => {
                const value = 12;
                const other = {empty: false, present: true, get: () => value} as IOptional<number>;
                expect(Optional.of(value).equals(other)).to.eq(true);
            });

            it('returns false for optionals with different content', () => {
                const other = {empty: false, present: true, get: () => 12} as IOptional<number>;
                expect(Optional.of(13).equals(other)).to.eq(false);
            });

            it('returns false if has identity but other is empty', () => {
                const other = {empty: true, present: false} as IOptional<number>;
                expect(Optional.of(12).equals(other)).to.eq(false);
            });

            it('returns false if is empty but other has identity', () => {
                const other = {empty: false, present: true, get: () => 12} as IOptional<number>;
                expect(Optional.empty().equals(other)).to.eq(false);
            });
        });

        describe('#toString()', () => {
            it('works for string', () => {
                expect(Optional.of('value').toString()).to.eq('Optional<value>');
            });

            it('works for missing identity', () => {
                expect(Optional.empty().toString()).to.eq('Optional<null>');
            });
        });
    });
});
