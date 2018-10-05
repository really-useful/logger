# @reallyuseful/logger

**A simple, powerful, and extensible Node.js logging system.**

👷🏼‍♀️*Under development*

```javascript
const { Logger } = require('@reallyuseful/logger');
const myLogger = new Logger();
myLogger.info('🌍 Hello, world!');
myLogger.err('💥 An error occurred.', { context: 42 });
```

![Screenshot](/screenshot.png)

## Logging to external services

By default log messages are printed to the console. They can also be sent to external services. Here are some `Transports` that will be available:

- Log to the console: `ConsoleTransport`
- AWS CloudWatch Logs
- Sentry.io
- syslog and Papertrail.io via rsyslog
- Graylog/GELF
- Any other service: adding a new `Transport` is easy

You can use multiple transports, and each can have a different severity level. You might print debug messages to the console, but only send a message to CloudWatch if it’s a warning or more severe.

## Promises

Each logging function returns a `Promise` that you can `await`. The `Promise` is resolved once all transports have finished logging. This is useful with AWS Lambda, which might otherwise pause or terminate your app before logging is complete.

## Usage

```javascript
const logger = new Logger([array of Transports]);
```

- If you don’t provide any transports, you’ll get a `ConsoleTransport`.
- Logging functions are named after the [syslog severity levels](https://en.wikipedia.org/wiki/Syslog#Severity_level). From least- to most-severe:

```javascript
logger.debug(…);
logger.info(…);
logger.notice(…);
logger.warning(…);
logger.err(…);
logger.crit(…);
logger.alert(…);
logger.emerg(…);
```

You can pass anything you like as arguments to the logging functions. Standard practice is to pass a string as the first argument, followed by additional JavaScript objects that you want to log. Notice that this is a drop-in replacement for most usages of the `console.*` JavaScript functions.

```javascript
logger.info('This is a string', { extraInfo: 42 }, [
  'Gryffindor',
  'Hufflepuff',
  'Ravenclaw',
  'Slytherin'
]);
```
