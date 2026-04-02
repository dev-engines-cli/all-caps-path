/**
 * @file Global Vitest setup file
 */

const consoleLog = console.log;

global.beforeEach(() => {
  console.log = vi.fn();
});

global.afterEach(() => {
  console.log = consoleLog;
});
