import { Level } from './level';

/** Anything that implements this interface may be used as a transport. */
export interface Transport {
  /** Minimum severity to be logged. */
  minimumSeverity?: Level;

  /** Write a log entry. Don’t resolve the Promise until the log entry has been saved. */
  log(level: Level, ...details: any[]): PromiseLike<void>;
}
