import test from 'ava';
import { Level } from './level';
import { Logger } from './logger';
import { Transport } from './transport';

class FakeTransport implements Transport {
  public level: Level | undefined = undefined;
  public timesCalled = 0;
  public calls: { [level: string]: number } = {};
  public log(level: Level) {
    this.timesCalled += 1;
    if (!(Level[level] in this.calls)) {
      this.calls[Level[level]] = 0;
    }
    this.calls[Level[level]] += 1;
    return Promise.resolve();
  }
}

test('basic logging works', async t => {
  const transport = new FakeTransport();
  const logger = new Logger(transport);
  await logger.emerg('emerg');
  await logger.alert('alert');
  await logger.crit('crit');
  await logger.err('err');
  await logger.warning('warning');
  await logger.notice('notice');
  await logger.info('info');
  await logger.debug('debug');
  t.is(transport.timesCalled, 8);
});

test('messages below the minimum severity level are ignored', async t => {
  const transport = new FakeTransport();
  transport.level = Level.err;
  const logger = new Logger(transport);
  await logger.emerg('emerg');
  await logger.alert('alert');
  await logger.crit('crit');
  await logger.err('err');
  await logger.warning('warning'); // should be skipped due to severity level
  await logger.notice('notice'); // should be skipped due to severity level
  await logger.info('info'); // should be skipped due to severity level
  await logger.debug('debug'); // should be skipped due to severity level
  t.is(transport.timesCalled, 4);
});

test('logging functions are called with the appropriate level', async t => {
  const transport = new FakeTransport();
  const logger = new Logger(transport);

  const expected: any = {};

  await logger.emerg('emerg');
  t.is(transport.timesCalled, 1);
  expected['emerg'] = 1;
  t.deepEqual(transport.calls, expected);

  await logger.alert('alert');
  t.is(transport.timesCalled, 2);
  expected['alert'] = 1;
  t.deepEqual(transport.calls, expected);

  await logger.crit('crit');
  t.is(transport.timesCalled, 3);
  expected['crit'] = 1;
  t.deepEqual(transport.calls, expected);

  await logger.err('err');
  t.is(transport.timesCalled, 4);
  expected['err'] = 1;
  t.deepEqual(transport.calls, expected);

  await logger.warning('warning');
  t.is(transport.timesCalled, 5);
  expected['warning'] = 1;
  t.deepEqual(transport.calls, expected);

  await logger.notice('notice');
  t.is(transport.timesCalled, 6);
  expected['notice'] = 1;
  t.deepEqual(transport.calls, expected);

  await logger.info('info');
  t.is(transport.timesCalled, 7);
  expected['info'] = 1;
  t.deepEqual(transport.calls, expected);

  await logger.debug('debug');
  t.is(transport.timesCalled, 8);
  expected['debug'] = 1;
  t.deepEqual(transport.calls, expected);
});

test('empty log statements are ignored', async t => {
  const transport = new FakeTransport();
  const logger = new Logger(transport);
  logger.emerg();
  logger.alert();
  logger.crit();
  logger.err();
  logger.warning();
  logger.notice();
  logger.info();
  logger.debug();
  t.is(transport.timesCalled, 0);
});
