import {
  addToPATH,
  existsInPATH,
  removeFromPATH
} from '@/index.js';

describe('Index', () => {
  test('Exports public functions', () => {
    expect(typeof(addToPATH))
      .toEqual('function');
  });

  describe('existsInPATH', () => {
    test('STUB: Does nothing', () => {
      expect(existsInPATH())
        .toEqual(false);
    });
  });

  describe('removeFromPATH', () => {
    test('STUB: Does nothing', () => {
      expect(removeFromPATH())
        .toEqual(undefined);
    });
  });
});
