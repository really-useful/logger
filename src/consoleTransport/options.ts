import { Level } from '../level';

/** the available options for configuring the console transport */
export default interface ConsoleTransportOptions {
  /** if true, console output is colorized */
  color?: boolean;
  /** if true, console output is prefixed with the current timestamp */
  timestamps?: boolean;
  /** if true, timestamps are printed in UTC instead of local time */
  useUtc?: boolean;
  /** don’t log anything below this severity level */
  level?: Level;
}
