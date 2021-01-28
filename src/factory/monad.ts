interface EitherPatterns<T, U> {
  left: (l: Error) => U;
  right: (r: T) => U;
}

export interface IMonad<T> {
  bind: <U>(fcn: (v: T) => IMonad<U>) => IMonad<U>;
  lift: <U>(fcn: (v: T) => U) => IMonad<U>;
  do: (patterns: EitherPatterns<T, void>) => IMonad<T>;
}

const Monad = <T>(mRight: T, mLeft: Error): IMonad<T> => {
  const monad: IMonad<T> = {
    lift: <U>(fcn: (v: T) => U): IMonad<U> => !!mLeft ? monad : Monad(fcn.apply(null, [mRight]), null),
    bind: <U>(fcn: (v: T, args?: T[]) => IMonad<U>): IMonad<U> => !!mLeft ? monad : fcn.apply(null, [mRight]),
    do: (patterns: EitherPatterns<T, void>): IMonad<T> => {
      !!mLeft
        ? patterns.left.apply(null, [mLeft])
        : patterns.right.apply(null, [mRight]);
      return monad;
    }
  };
  return monad;
};

export default Monad;
