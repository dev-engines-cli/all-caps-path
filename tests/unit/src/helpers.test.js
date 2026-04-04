import { exists } from '@/helpers.js';

vi.mock('node:fs', () => {
  return {
    existsSync: vi.fn(() => {
      if (global.existsSyncShouldThrow) {
        throw 'error';
      }
      return true;
    })
  };
});

const file = './file.txt';
const logger = vi.fn();

describe('Helpers', () => {
  beforeEach(() => {
    global.existsSyncShouldThrow = false;
  });

  test('Checks file exists', () => {
    const result = exists(file, logger);

    expect(result)
      .toEqual(true);

    expect(logger)
      .not.toHaveBeenCalled();
  });

  test('Fails to check file existence', () => {
    global.existsSyncShouldThrow = true;
    const result = exists(file, logger);

    expect(result)
      .toEqual(false);

    expect(logger)
      .toHaveBeenCalledWith('Error checking existence of ' + file);
  });
});
