import { ConsoleTransport } from './consoleTransport';
import { Level } from './level';
import { Transport } from './transport';

/**
 * The @reallyuseful Logger.
 */
export class Logger {
  private readonly transports: Transport[];

  /**
   * Construct a new Logger using the provided Transports.
   * @param transports a transport or an array of Transports to use. If not provided,
   *  creates a ConsoleTransport.
   */
  constructor(transports: Transport | Transport[] = new ConsoleTransport()) {
    this.transports = (Array.isArray(transports) && transports) || [transports];
  }

  /**
   * Write a log entry to all configured transports.
   * @param level the severity level
   * @param details the details to be logged
   */
  log(level: Level, ...details: any[]) {
    if (!details.length) {
      return Promise.resolve();
    }

    // only log to transports configured for this severity level
    const transportsToLog = this.transports.filter(
      transport => typeof transport.level !== 'number' || level <= transport.level
    );

    const promises = transportsToLog.map(transport => transport.log(level, ...details));

    return Promise.all(promises).then(() => {});
  }

  /** System is unusable */
  emerg(...details: any[]) {
    return this.log(Level.emerg, ...details);
  }

  /** Action must be taken immediately */
  alert(...details: any[]) {
    return this.log(Level.alert, ...details);
  }

  /** Critical conditions */
  crit(...details: any[]) {
    return this.log(Level.crit, ...details);
  }

  /** Error conditions */
  err(...details: any[]) {
    return this.log(Level.err, ...details);
  }

  /** Warning conditions */
  warning(...details: any[]) {
    return this.log(Level.warning, ...details);
  }

  /** Normal but significant conditions */
  notice(...details: any[]) {
    return this.log(Level.notice, ...details);
  }

  /** Informational messages */
  info(...details: any[]) {
    return this.log(Level.info, ...details);
  }

  /** Debug-level messages */
  debug(...details: any[]) {
    return this.log(Level.debug, ...details);
  }
}
