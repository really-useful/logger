import chalk from 'chalk';

/** color mappings for each log severity level */
export const ColorFunctions: { [level: number]: typeof chalk } = {
  0: chalk.redBright.bgWhite.underline,
  1: chalk.redBright.bgWhite,
  2: chalk.redBright.underline,
  3: chalk.redBright,
  4: chalk.yellow,
  5: chalk.white,
  6: chalk.green,
  7: chalk.gray
};
