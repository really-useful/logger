import { ConsoleTransport } from './consoleTransport';
import { Level } from './level';
import { Transport } from './transport';

export class Logger {
  private readonly transports: Transport[];

  constructor(transports: Transport | Transport[] = new ConsoleTransport()) {
    this.transports = (Array.isArray(transports) && transports) || [transports];
  }

  /** Write a log entry to all configured transports. */
  log(level: Level, ...details: any[]): Promise<void> {
    const promises = this.transports.map(transport => {
      if (typeof transport.level === 'number' && level > transport.level) {
        return; // not severe enough to log
      }
      return transport.log(level, ...details);
    });
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
