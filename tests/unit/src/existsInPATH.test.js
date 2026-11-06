import { execSync } from 'node:child_process';

import {
  existsInPATH,
  getWindowsSystemPATHFromRegistry
} from '@/existsInPATH.js';

vi.mock('node:child_process', () => {
  return {
    execSync: vi.fn()
  };
});
vi.mock('node:os', () => {
  return {
    platform: vi.fn(() => {
      return global.mockedPlatform;
    })
  };
});

const mockedExecSync = vi.mocked(execSync);
const logger = vi.fn();

describe('existsInPATH.js', () => {
  describe('getWindowsSystemPATHFromRegistry', () => {
    beforeEach(() => {
      global.mockedPlatform = 'win32';
    });

    test('Reading PATH from registry fails', () => {
      mockedExecSync.mockThrow(error);
      const results = getWindowsSystemPATHFromRegistry(logger);

      expect(results)
        .toEqual([]);

      expect(logger)
        .toHaveBeenCalledWith('Error reading PATH data from Windows Registry.', error);
    });
  });

  describe('existsInPATH', () => {
    describe('Windows', () => {
      beforeEach(() => {
        global.mockedPlatform = 'win32';
      });

      const folder = 'C:\\folder';

      test('Reading PATH from registry fails', () => {
        mockedExecSync.mockThrow(error);
        addToWindowsPATH(folder, logger);

        expect(logger)
          .toHaveBeenCalledWith('Error reading PATH data from Windows Registry.', error);
      });
    });

    describe('Unix', () => {
      beforeEach(() => {
        global.mockedPlatform = 'linux';
      });

      test('STUB: Does nothing', () => {
        expect(existsInPATH())
          .toEqual(false);
      });
    });
  });
});
