import { addToWindowsPATH } from '@/addToPATH/addToWindowsPATH.js';

describe('addToWindowsPATH', () => {
  const folder = 'C:\\folder';
  const logger = vi.fn();

  test('STUB: Does nothing', () => {
    addToWindowsPATH(folder, logger);

    expect(logger)
      .toHaveBeenCalledWith('STUB: Windows', folder);
  });
});
