import { fs, vol } from 'memfs';

import { addToPATH } from '@/addToPATH/index.js';

vi.mock('node:fs', () => {
  return fs;
});
vi.mock('node:os', () => {
  return {
    platform: vi.fn(() => {
      return global.mockedPlatform;
    })
  };
});
vi.mock('../../../../src/addToPATH/addToUnixPATH.js', () => {
  return {
    addToUnixPATH: vi.fn((folder, logger) => {
      logger('STUB: Unix', folder);
    })
  };
});
vi.mock('../../../../src/addToPATH/addToWindowsPATH.js', () => {
  return {
    addToWindowsPATH: vi.fn((folder, logger) => {
      logger('STUB: Windows', folder);
    })
  };
});
const logger = vi.fn();

describe('addToPATH', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
  });

  describe('Windows', () => {
    const folder = 'C:\\folder';

    beforeEach(() => {
      global.mockedPlatform = 'win32';
      vol.mkdirSync(folder, { recursive: true });
    });

    describe('Input checks', () => {
      test('Logger is not a function', () => {
        addToPATH(folder, 'NOT_A_FUNCTION');

        expect(logger)
          .not.toHaveBeenCalled();

        expect(console.log)
          .toHaveBeenCalledWith('STUB: Windows', folder);
      });

      test('Folder is not a string', () => {
        addToPATH(123, logger);

        expect(logger)
          .toHaveBeenCalledWith('addToPATH requires `folder` to be a string. Aborting.');

        expect(logger)
          .not.toHaveBeenCalledWith('STUB: Windows', folder);
      });

      test('Folder does not exist', () => {
        addToPATH('C:\\folder2', logger);

        expect(logger)
          .toHaveBeenCalledWith('addToPATH requires `folder` to be a file path that exists. Aborting.');

        expect(logger)
          .not.toHaveBeenCalledWith('STUB: Windows', folder);
      });
    });

    test('Uses Windows logic based on platform', () => {
      addToPATH(folder, logger);

      expect(logger)
        .toHaveBeenCalledWith('STUB: Windows', folder);
    });
  });

  describe('Unix', () => {
    const folder = '/folder';

    beforeEach(() => {
      global.mockedPlatform = 'linux';
      vol.mkdirSync(folder, { recursive: true });
    });

    test('Uses Unix logic based on platform', () => {
      addToPATH(folder, logger);

      expect(logger)
        .toHaveBeenCalledWith('STUB: Unix', folder);
    });
  });
});
