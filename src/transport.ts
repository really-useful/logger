import { Level } from './level';

/** Anything that implements this interface may be used as a transport. */
export interface Transport {
  /** Log entries must be at least this severity, or they will be ignored. */
  level?: Level;

  /**
   * Write a log entry. The Promise should be resolved only after the log entry has been
   * committed.
   */
  log(level: Level, ...details: any[]): PromiseLike<void>;
}
