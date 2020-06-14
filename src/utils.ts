export function isFunction(fn: any) {
  return fn && {}.toString.call(fn) === '[object Function]';
}
