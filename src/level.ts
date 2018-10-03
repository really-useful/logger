/** Standard syslog logging levels. Lower numbers indicate higher severity, */
export enum Level {
  /** System is unusable */
  emerg = 0,
  /** Action must be taken immediately */
  alert = 1,
  /** Critical conditions */
  crit = 2,
  /** Error conditions */
  err = 3,
  /** Warning conditions */
  warning = 4,
  /** Normal but significant conditions */
  notice = 5,
  /** Informational messages */
  info = 6,
  /** Debug-level messages */
  debug = 7
}
