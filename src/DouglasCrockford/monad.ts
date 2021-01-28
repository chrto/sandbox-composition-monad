export function MONAD() {
  const m_prototype = Object.create(null);
  function unit(value) {
    const monadInstance = Object.create(m_prototype);
    const modifier = () =>
      value === null || value === undefined
        ? monadInstance.bind = function () {
          return monadInstance;
        }
        : monadInstance.bind = function (func, args) {
          return func.apply(null, [value, ...(args || [])]);
        }
    modifier()
    return monadInstance;
  };

  unit.bind_method = function (name, func) {
    m_prototype[name] = function (...args) {
      return this.bind.apply(null, [func, args]);
    };
    return unit;
  };
  unit.lift_method = function (name, func) {
    m_prototype[name] = function (...args) {
      return unit(this.bind.apply(null, [func, args]));
    };
    return unit;
  };
  return unit;
}

