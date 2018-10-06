/** which console.* function to use for each log severity level */
export default {
  emerg: console.error,
  alert: console.error,
  crit: console.error,
  err: console.error,
  warning: console.warn,
  notice: console.log,
  info: console.info,
  debug: console.debug
} as { [levelName: string]: typeof console.log };
