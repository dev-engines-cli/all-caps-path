import {
  addToPATH,
  ALLOWED_SHELLS,
  existsInPATH,
  removeFromPATH
} from '../../index.js';

describe('Index', () => {
  test('Exports public functions', () => {
    expect(Array.isArray(ALLOWED_SHELLS))
      .toEqual(true);

    const shellsAreStrings = ALLOWED_SHELLS.every((shell) => {
      return typeof(shell) === 'string';
    });

    expect(shellsAreStrings)
      .toEqual(true);

    expect(typeof(addToPATH))
      .toEqual('function');

    expect(typeof(existsInPATH))
      .toEqual('function');

    expect(typeof(removeFromPATH))
      .toEqual('function');
  });
});
