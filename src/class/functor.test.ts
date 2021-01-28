import Functor, { IFunctor } from './functor';
import { expect as expectChai } from 'chai';

describe(`'Functor' object implementation.`, () => {
  const plus = (a) => (b) => a + b;
  const plus3 = plus(3);

  let functor: IFunctor<number> = new Functor(2);

  it('Happy path', () => {
    functor
      .lift(plus3)
      .lift(plus(5))
      .lift((val: number) => {
        expectChai(val)
          .to.be.an('number')
          .which.is.equal(10);
      });
  });
});
