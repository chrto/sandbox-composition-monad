export interface IFunctor<T> {
  lift: <I, O>(fcn: (v: I) => O) => IFunctor<O>;
  done: () => T;
}

const Functor = <T>(value: T): IFunctor<T> => ({
  lift: <I, O>(func: (v: I) => O): IFunctor<O> => Functor(func.apply(null, [value])),
  done: (): T => value
});

export default Functor;
