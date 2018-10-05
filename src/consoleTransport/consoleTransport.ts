import * as util from 'util';
import { Level } from '../level';
import { Transport } from '../transport';
import ConsoleColors from './colors';
import ConsoleDefaults from './defaults';
import levelFunctions from './levelFunctions';
import ConsoleTransportOptions from './options';

const { highlight } = require('cardinal');

// length of the timestamp string returned by formatTimestamp()
const TIMESTAMP_LENGTH = 23;

/** if we aren’t using colors, we use this do-nothing function to (not) colorize output */
function noop(x: string) {
  return x;
}

/** Log to the console. */
export class ConsoleTransport implements Transport {
  private readonly options: ConsoleTransportOptions;

  /** create a new ConsoleTransport */
  constructor(options?: ConsoleTransportOptions) {
    this.options = Object.assign({}, ConsoleDefaults, options);
  }

  /** tell the Logger to only send us messages of this severity level or above */
  get level() {
    return this.options.level;
  }

  /** get the column that log details are aligned to */
  private get alignColumn() {
    return this.options.timestamps ? 36 : 11;
  }

  /** get the name of the severity level, formatted */
  private static getLevelString(level: Level, color = true) {
    const levelColorFn = (color && ConsoleColors[level]) || noop;
    return `[${levelColorFn(Level[level])}]`;
  }

  /** format one detail item */
  private static getFormattedDetailItem(detail: any, color = true) {
    const syntaxHighlightFn = (color && highlight) || noop;
    let result: string;

    switch (typeof detail) {
      case 'string':
        // strings are passed through unchanged
        result = detail;
        break;

      case 'function':
        // functions are stringified and highlighted
        result = syntaxHighlightFn(detail.toString());
        break;

      default:
        // everything else is formatted and highlighted
        result = syntaxHighlightFn(util.format('%O', detail));
    }

    return result;
  }

  /** format the details portion of the output */
  private static getFormattedMessage(details: any[], color = true) {
    return details
      .map(detail => ConsoleTransport.getFormattedDetailItem(detail, color))
      .join(' ');
  }

  /** return an ISO-8601 formatted timestamp string */
  private static getTimestamp(useUtc: boolean, date = new Date()) {
    const [yr, mo, day, hr, min, sec, milli] = (useUtc && [
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    ]) || [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ];

    const yrStr = yr.toString();
    const moStr = mo.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const hrStr = hr.toString().padStart(2, '0');
    const minStr = min.toString().padStart(2, '0');
    const secStr = sec.toString().padStart(2, '0');
    const milliStr = milli.toString().padStart(3, '0');

    let result = `${yrStr}-${moStr}-${dayStr} ${hrStr}:${minStr}:${secStr}.${milliStr}`;

    return result;
  }

  /** calculate how many spaces will be required to align the details output */
  private getSpaceCount(level: Level) {
    let messageLength = 0;

    if (this.options.timestamps) {
      messageLength += TIMESTAMP_LENGTH;
      messageLength += 2; // 2 spaces after timestamp
    }

    messageLength += ConsoleTransport.getLevelString(level, false).length;
    messageLength + 2; // min 2 spaces after the [level]

    return Math.max(0, this.alignColumn - messageLength);
  }

  /** log to the console */
  async log(level: Level, ...details: any[]): Promise<void> {
    const spacesNeeded = this.getSpaceCount(level);
    const spaces = ' '.repeat(spacesNeeded);

    let output = '';

    if (this.options.timestamps) {
      output += ConsoleTransport.getTimestamp(this.options.useUtc || false);
      output += '  ';
    }

    output += ConsoleTransport.getLevelString(level, this.options.color);
    output += spaces;

    if (this.options.prefix) {
      output += this.options.prefix;
      output += '  ';
    }

    output += ConsoleTransport.getFormattedMessage(details, this.options.color);

    const outputFn = levelFunctions[level];
    outputFn(output);
  }
}
