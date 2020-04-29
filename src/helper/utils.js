export function isFunction(obj) {
    return typeof obj === 'function';
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isConstructable(fn) {
    const constructableFunctionRegex = /^function\b\s[A-Z].*/;
    const classRegex = /^class\b/;

    // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数
    return (
      (fn.prototype && Object.getOwnPropertyNames(fn.prototype).filter(k => k !== 'constructor').length) ||
      constructableFunctionRegex.test(fn.toString()) ||
      classRegex.test(fn.toString())
    );
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function noop () {}

export function Deferred() {
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject
  })
}

