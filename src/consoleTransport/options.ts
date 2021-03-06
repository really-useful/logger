import { Level } from '../level';

/** the available options for configuring the ConsoleTransport */
export interface ConsoleTransportOptions {
  /** don’t log anything below this severity level (default: log everything) */
  minimumSeverity?: Level;
  /** if true, console output is colorized (default: true) */
  color?: boolean;
  /** if true, console output is prefixed with the current timestamp (default: true) */
  timestamps?: boolean;
  /** if provided, prefix each log message’s details with this string */
  prefix?: string;
}
