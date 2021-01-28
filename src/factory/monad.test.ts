import Monad, { IMonad } from './monad';
import { expect as expectChai, assert } from 'chai';
// import { expect as chaiExpect } from 'chai';

describe(`'Monad' factory functions implementation.`, () => {
  const div = (a: number) => (b: number): IMonad<number> =>
    (a === 0)
      ? Monad(null, new Error('Divide by zero'))
      : Monad(b / a, null);

  const plus = (a: number) => (b: number): number => a + b;
  const plus3 = plus(3);
  const plus10 = plus(10);


  it('Happy path', () => {
    Monad(3, null)
      .lift(plus3)
      .bind(div(2))
      .lift(plus3)
      .bind(div(2))
      .do({
        right: (value: number) => {
          expectChai(value)
            .to.be.an('number')
            .which.is.equal(3);
        },
        left: (error: Error) => {
          assert.fail(error, null, `Left side was not expected. ${'\n'} ${error.message}`);
        }
      });
  });

  it('Error path', () => {
    Monad(3, null)
      .lift(plus3)
      .bind(div(2))
      .bind(div(0))
      .lift(plus10)
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
