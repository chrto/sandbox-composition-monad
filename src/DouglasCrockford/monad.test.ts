import { MONAD } from './monad';
import { expect as expectChai } from 'chai';

describe(`'Monad' factory functions implementation.`, () => {
  describe('identity monad', () => {
    const identity = MONAD();
    it('happy path', () => {
      identity('Hello Word')
        .bind((value: string) => identity(`${value}!`))
        .bind((_value: string) => identity(null))
        .bind((value: string) => identity(`${value}!`))
        .bind((value: string) => {
          value
          expectChai(value)
            .to.be.an('string')
            .which.is.equal('Hello Word!!');
          return identity(value);
        })
    });
  });

  describe(`add new method in to prototype`, () => {
    const monadType = MONAD();
    const exclaim = (val) => `${val}!`;
    const question = (val, ...restArgs) => monadType(`${val}?${restArgs.join('')}`);
    monadType
      .bind_method('question', question)
      .lift_method('exclaim', exclaim)
      .lift_method('log', (val, ...restArgs) => {
        console.log(val, ...restArgs);
        return val;
      });

    it('happy path', () => {
      monadType('Hello')
        .exclaim()
        .question('??', '?', '??')
        .log()
        .exclaim()
        .exclaim()
        .log('!', '!')
        .log('!', '!', '!', '!')
        .log('!', '!', '!', '!');
    });
  });
});
