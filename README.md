# @reallyuseful/logger

**A simple and extensible logging system for Node.js.**

👷 *Under development*

```javascript
const { Logger } = require('@reallyuseful/logger');
const myLogger = new Logger();
myLogger.info('🌍 Hello, world!');
myLogger.err('💥 An error occurred.', { context: 42 });
```

![Screenshot](/screenshot.png)

## Logging to external services

You can log to multiple services at once.

- The console: `ConsoleTransport`
- AWS CloudWatch Logs
- Sentry.io
- syslog and Papertrail.io via rsyslog
- Graylog/GELF
- Any other service: adding a new `Transport` is easy

## Promises

Each logging function returns a `Promise` that is resolved once all transports have finished logging.

## Usage

```javascript
const logger = new Logger([array of Transports]);
```

- If you don’t provide any transports, you’ll get a `ConsoleTransport`.
- Logging functions are named after the [syslog severity levels](https://en.wikipedia.org/wiki/Syslog#Severity_level). Here they are from least- to most-severe:

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

You can pass anything as arguments to these functions. Standard practice is to pass a string as the first argument, followed by additional JavaScript objects that you want to log. (Just like `console.log`.)

```javascript
logger.info(
  'This is a string',
  { extraInfo: 42 },
  [ 'Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin' ]
);
```

## Add your own logging service

If you need to log to a service that isn’t listed above, you can easily add support by creating a `Transport` for it.

A `Transport` is any object with the following properties:

* A `log()` method.
* A `level` properity (optional).

### log(level, ...details)

The `log` method takes a severity level as its first argument. Any additional arguments are the details to be logged.

The `log` method returns a `Promise`, and you should not resolve it until logging is complete. For example, if you are logging to a file, don’t resolve the `Promise` until the message has been written to disk.

### level *optional property*

If your transport object has a `level` property, this is the *minimum* severity to be logged. For example if your object has a `level` property that is set to `Level.warning`, then your transport will receive log messages for `warning`, `err`, `crit`, `alert` and `emerg`, but not for `debug`, `info` or `notice`.