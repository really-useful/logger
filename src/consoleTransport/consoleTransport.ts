import * as util from 'util';
import { Level } from '../level';
import { Transport } from '../transport';
import ConsoleColors from './colors';
import ConsoleDefaults from './defaults';
import formatTimestamp from './formatTimestamp';
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

  /** tell the logger to only send us messages of this severity level or greater */
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
  private static formatDetailItem(detail: any, color = true) {
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
  private static formatMessage(details: any[], color = true) {
    return details
      .map(detail => ConsoleTransport.formatDetailItem(detail, color))
      .join(' ');
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

    // build the output message
    let output = '';

    if (this.options.timestamps) {
      output += formatTimestamp(this.options.useUtc || false);
      output += '  ';
    }

    output += ConsoleTransport.getLevelString(level, this.options.color);
    output += spaces;

    output += ConsoleTransport.formatMessage(details, this.options.color);

    const outputFn = levelFunctions[level];
    outputFn(output);
  }
}
