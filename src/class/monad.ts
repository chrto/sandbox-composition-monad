interface EitherPatterns<T, U> {
  left: (l: Error) => U;
  right: (r: T) => U;
}
export interface IMonad<T> {
  mRight: T;
  mLeft: Error;
  lift: <I, O>(fcn: (v: I) => O) => IMonad<O>;
  bind: <I, O>(fcn: (v: I) => IMonad<O>) => IMonad<O>;
  do: (patterns: EitherPatterns<T, void>) => IMonad<T>;
}

const Monad: <T>(mRight: T, mLeft?: Error) => void = function (mRight, mLeft) {
  this.mLeft = mLeft;
  this.mRight = mRight;
};

Monad.prototype.lift = function <I, O>(fcn: (v: I) => O): IMonad<O> {
  return !!this.mLeft ? this : new Monad(fcn.apply(null, [this.mRight]));
};

Monad.prototype.bind = function <I, O>(fcn: (v: I) => IMonad<O>): IMonad<O> {
  return !!this.mLeft ? this : fcn.apply(null, [this.mRight]);
};

// TODO
Monad.prototype.method = function <I, O>(fcn: (v: I) => IMonad<O>, args?: I[]): IMonad<O> {
  return !!this.mLeft ? this : fcn.apply(null, [this.mRight, ...args || []]);
};

Monad.prototype.do = function <T>(patterns: EitherPatterns<T, void>): IMonad<T> {
  !!this.mLeft
    ? patterns.left.apply(null, [this.mLeft])
    : patterns.right.apply(null, [this.mRight]);
  return this;
};

export default Monad;
