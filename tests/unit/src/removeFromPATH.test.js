import { removeFromPATH } from '@/removeFromPATH.js';

vi.mock('node:os', () => {
  return {
    platform: vi.fn(() => {
      return global.mockedPlatform;
    })
  };
});

describe('removeFromPATH', () => {
  describe('Windows', () => {
    const folder = 'C:\\folder';

    beforeEach(() => {
      global.mockedPlatform = 'win32';
    });

    test('STUB: Does nothing', () => {
      removeFromPATH(folder);

      expect(console.log)
        .toHaveBeenCalledWith('STUB: Windows', folder);
    });
  });

  describe('Unix', () => {
    const folder = '/folder';

    beforeEach(() => {
      global.mockedPlatform = 'linux';
    });

    test('STUB: Does nothing', () => {
      removeFromPATH(folder);

      expect(console.log)
        .toHaveBeenCalledWith('STUB: Unix', folder);
    });
  });
});
