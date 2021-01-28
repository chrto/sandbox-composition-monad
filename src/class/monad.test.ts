import Monad, { IMonad } from './monad';
import { assert, expect as expectChai } from 'chai';

describe(`'Monad' factory functions implementation.`, () => {
  describe('Monad<number>', () => {
    const sum = (a: number) => (b: number): number => a + b;
    const minus = (a: number) => (b: number): IMonad<number> => new Monad(b - a);
    const div = (a: number) => (b: number): IMonad<number> =>
      (a === 0)
        ? new Monad(null, new Error('Divide by zero'))
        : new Monad(b / a);

    const either = new Monad(2);

    it('Happy path', () => {
      either
        .lift(sum(3))
        .lift(sum(10))
        .bind(minus(3))
        .bind(div(2))
        .bind(minus(3))
        .lift(sum(1))
        .bind(div(2))
        .do({
          right: (value: number) => {
            expectChai(value)
              .to.be.an('number')
              .which.is.equal(2);
          },
          left: (error: Error) => {
            assert.fail(error, null, `Left side was not expected. ${'\n'} ${error.message}`);
          }
        });
    });

    it('Error path', () => {
      either
        .lift(sum(3))
        .lift(sum(10))
        .bind(minus(3))
        .bind(div(0))
        .bind(div(2))
        .bind(minus(3))
        .lift(sum(1))
        .bind(div(2))
        .do({
          right: (value: number) => {
            assert.fail(value, null, 'Right side was not expected.');
          },
          left: (error: Error) => {
            expectChai(error)
              .to.be.instanceOf(Error)
            expectChai(error.message)
              .to.be.equal('Divide by zero');
          }
        });
    });
  });

  describe('Monad<string>', () => {
    const addToString = (tail: string) => (val: string): string => `${val}${tail}`;
    const addToStringM = (tail: string) => (val: string): IMonad<string> => new Monad(val).lift(addToString(tail));
    const addSpace = addToString(' ');
    const stringFunctor = new Monad('Hello')

    it('Happy path', () => {
      stringFunctor
        .lift(addSpace)
        .lift(addToString('world'))
        .bind(addToStringM('!'))
        .do({
          right: (value: number) => {
            expectChai(value)
              .to.be.an('string')
              .which.is.equal('Hello world!');
          },
          left: (error: Error) => {
            assert.fail(error, null, `Left side was not expected. ${'\n'} ${error.message}`);
          }
        });
    });
  });
});
