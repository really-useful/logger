const placeholderRx = /%[sdifjoO]/g;

/**
 * Support printf-like format strings for compatibility with console.log and similar
 * functions. See https://nodejs.org/api/console.html#console_console_log_data_args.
 *
 * Returns the number of "%d" or similar format specifiers found in the message.
 */
export default function countFormatPlaceholders(message: any) {
  const matches = message.match(placeholderRx);
  return (matches && matches.length) || 0;
}
