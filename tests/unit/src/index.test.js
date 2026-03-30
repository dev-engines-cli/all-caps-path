import {
  addToPATH,
  existsInPATH,
  removeFromPATH
} from '@/index.js';

describe('Index', () => {
  test('Exports public functions', () => {
    expect(typeof(addToPATH))
      .toEqual('function');

    expect(typeof(existsInPATH))
      .toEqual('function');
  });

  describe('removeFromPATH', () => {
    test('STUB: Does nothing', () => {
      expect(removeFromPATH())
        .toEqual(undefined);
    });
  });
});
