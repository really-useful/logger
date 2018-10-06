import test, { afterEach, beforeEach } from 'ava';
import * as td from 'testdouble';
import { Level } from '../level';
import levelFunctions from './levelFunctions';

let level0: any,
  level1: any,
  level2: any,
  level3: any,
  level4: any,
  level5: any,
  level6: any,
  level7: any;

let ConsoleTransport: any;

beforeEach(() => {
  level0 = td.replace(levelFunctions, 'emerg');
  level1 = td.replace(levelFunctions, 'alert');
  level2 = td.replace(levelFunctions, 'crit');
  level3 = td.replace(levelFunctions, 'err');
  level4 = td.replace(levelFunctions, 'warning');
  level5 = td.replace(levelFunctions, 'notice');
  level6 = td.replace(levelFunctions, 'info');
  level7 = td.replace(levelFunctions, 'debug');

  ConsoleTransport = require('./consoleTransport').ConsoleTransport;
});

afterEach(() => {
  td.reset();
});

test('console messages are logged', async t => {
  let transport = new ConsoleTransport();

  await transport.log(Level.emerg, 'message 0');
  await transport.log(Level.alert, 'message 1');
  await transport.log(Level.crit, 'message 2');
  await transport.log(Level.err, 'message 3');
  await transport.log(Level.warning, 'message 4');
  await transport.log(Level.notice, 'message 5');
  await transport.log(Level.info, 'message 6');
  await transport.log(Level.debug, 'message 7');

  t.notThrows(() => td.verify(level0(td.matchers.contains('message 0'))));
  t.notThrows(() => td.verify(level1(td.matchers.contains('message 1'))));
  t.notThrows(() => td.verify(level2(td.matchers.contains('message 2'))));
  t.notThrows(() => td.verify(level3(td.matchers.contains('message 3'))));
  t.notThrows(() => td.verify(level4(td.matchers.contains('message 4'))));
  t.notThrows(() => td.verify(level5(td.matchers.contains('message 5'))));
  t.notThrows(() => td.verify(level6(td.matchers.contains('message 6'))));
  t.notThrows(() => td.verify(level7(td.matchers.contains('message 7'))));
});
