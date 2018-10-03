# @reallyuseful/logger

**A useful and simple Node.js logging system.**

A logging system with attractive, colorized console output. It’s easy to extend to work
with 3rd-party logging services, and it works great with Amazon Lambda.

This can be used as a drop-in replacement for `console.log`, `console.error`, and similar
functions.

You can log to multiple services at once, and set the minimum severity for each service.
For example, you may want verbose logging to the console, but only errors to be logged to
a hosted service.

Logging commands return a `Promise` that you can `await`. This is important when running
under AWS Lambda, so you can ensure that logging is complete before Lambda sleeps or
terminates your code.

## Install

`npm i @reallyuseful/logger`
