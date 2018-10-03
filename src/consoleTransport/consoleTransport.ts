import * as util from 'util';
import { Level } from '../level';
import { Transport } from '../transport';
import ConsoleColors from './colors';
import countFormatPlaceholders from './countFormatPlaceholders';
import ConsoleDefaults from './defaults';
import formatTimestamp from './formatTimestamp';
import levelFunctions from './levelFunctions';
import ConsoleTransportOptions from './options';

const { highlight } = require('cardinal');

// length of the timestamp string returned by formatTimestamp()
const TIMESTAMP_LENGTH = 23;

// if we aren’t using colors, we use this do-nothing function to (not) colorize output
function noop(x: string) {
  return x;
}

/** Log to the console. */
export class ConsoleTransport implements Transport {
  private readonly options: ConsoleTransportOptions;

  constructor(options?: ConsoleTransportOptions) {
    this.options = Object.assign({}, ConsoleDefaults, options);
  }

  get level() {
    return this.options.level;
  }

  private get alignColumn() {
    return this.options.timestamps ? 36 : 11;
  }

  /** format the details portion of the output */
  private formatMessage(details: any[]) {
    // function used to syntax-highlight the details JSON
    const syntaxHighlightFn = (this.options.color && highlight) || noop;

    return details
      .map(detail => {
        // strings are passed through unchanged
        if (typeof detail === 'string') {
          return detail;
        }

        // functions are stringified and highlighted
        if (typeof detail === 'function') {
          return syntaxHighlightFn(detail.toString());
        }

        // everything else is formatted and highlighted
        return syntaxHighlightFn(util.format('%O', detail));
      })
      .join(' ');
  }

  /** log to the console */
  async log(level: Level, ...details: any[]): Promise<void> {
    // how many spaces are needed to make the output line up?
    let messageLength = 0;

    if (this.options.timestamps) {
      messageLength += TIMESTAMP_LENGTH;
      messageLength += 2; // 2 spaces after timestamp
    }

    messageLength += `[${Level[level]}]`.length;
    messageLength + 2; // min 2 spaces after the [level]

    const spacesNeeded = Math.max(0, this.alignColumn - messageLength);
    const spaces = ' '.repeat(spacesNeeded);

    // function used to colorize the [level] text
    const levelColorFn = (this.options.color && ConsoleColors[level]) || noop;

    // build the output message
    let output = '';

    if (this.options.timestamps) {
      output += formatTimestamp(this.options.useUtc || false);
      output += '  ';
    }

    output += `[${levelColorFn(Level[level])}]`;
    output += spaces;

    // support format placeholders, similar to the console.* functions
    if (typeof details[0] === 'string') {
      const placeholdersCount = countFormatPlaceholders(details[0]);
      if (placeholdersCount) {
        // build the message using its placeholders
        const message = util.format(
          details[0],
          ...details.slice(1, placeholdersCount + 1)
        );
        // any additional details get passed through as usual
        const messageAndRemainingDetails = Array.prototype.concat(
          message,
          details.slice(placeholdersCount + 1)
        );
        output += this.formatMessage(messageAndRemainingDetails);
      } else {
        // string, but no placeholders
        output += this.formatMessage(details);
      }
    } else {
      output += this.formatMessage(details);
    }

    const outputFn = levelFunctions[level];
    outputFn(output);
  }
}
