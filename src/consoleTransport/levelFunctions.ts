/** which console.* function to use for each log severity level */
export default {
  0: console.error,
  1: console.error,
  2: console.error,
  3: console.error,
  4: console.warn,
  5: console.log,
  6: console.info,
  7: console.debug
} as { [level: number]: typeof console.log };
