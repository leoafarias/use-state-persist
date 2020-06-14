/**
 * Checks if value is a function
 * @param object
 * @returns
 */
export function isFunction(object: any) {
  return !!(object && object.constructor && object.call && object.apply);
}
