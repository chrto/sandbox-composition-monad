export interface IFunctor<T> {
  val: T;
  lift: <I, O>(fcn: (x: I) => O) => IFunctor<O>;
  done: () => T;
}
const Functor: <T>(val: T) => void = function (val) {
  this.val = val;
};

Functor.prototype.lift = function <I, O>(fcn: (x: I) => O): IFunctor<O> {
  return new Functor(fcn(this.val));
};

Functor.prototype.done = function <T>(): T {
  return this.val;
};

export default Functor;
