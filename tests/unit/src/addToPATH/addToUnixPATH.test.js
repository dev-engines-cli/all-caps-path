import { join } from 'node:path';

import { fs, vol } from 'memfs';

import { addToUnixPATH } from '@/addToPATH/addToUnixPATH.js';
import { ALLOWED_SHELLS } from '@/helpers.js';

vi.mock('node:fs', () => {
  return {
    ...fs,
    appendFileSync: vi.fn((file, data) => {
      if (global.appendFileSyncShouldThrow) {
        throw 'error';
      } else {
        return fs.appendFileSync(file, data);
      }
    }),
    readFileSync: vi.fn((file, data) => {
      if (global.readFileSyncShouldThrow) {
        throw 'error';
      } else {
        return fs.readFileSync(file, data);
      }
    })
  };
});

vi.mock('node:os', () => {
  return {
    homedir: vi.fn(() => {
      return join('/home', 'FAKE_USER');
    }),
    userInfo: vi.fn(() => {
      let shell = '/bin/bash';
      if (global.makeShellZsh) {
        shell = 'zsh';
      }
      if (global.makeFakeShell) {
        shell = 'FAKE';
      }
      if (global.makeShellEmpty) {
        shell = '';
      }
      return { shell };
    })
  };
});

const folder = '/folder';
const logger = vi.fn();
const EXPORT_LINE = '\nexport PATH="/folder:$PATH"\n';

describe('addToUnixPATH', () => {
  beforeEach(() => {
    global.appendFileSyncShouldThrow = false;
    global.makeShellEmpty = false;
    global.makeFakeShell = false;
    global.makeShellZsh = false;
    global.readFileSyncShouldThrow = false;
    vi.resetAllMocks();
    vol.reset();
    vol.mkdirSync(folder, { recursive: true });
    vol.mkdirSync(join('/home', 'FAKE_USER'), { recursive: true });
  });

  describe('Explicitly defined config', () => {
    test.each(ALLOWED_SHELLS)('Writes to %s config', (shell) => {
      const config = join('/home', 'FAKE_USER', shell);

      expect(addToUnixPATH(folder, logger, shell))
        .toEqual(undefined);

      expect(logger)
        .not.toHaveBeenCalled();

      expect(String(vol.readFileSync(config)))
        .toEqual(EXPORT_LINE);
    });
  });

  describe('Guessing config', () => {
    test('Writes to zsh config', () => {
      global.makeShellZsh = true;
      const zshrc = join('/home', 'FAKE_USER', '.zshrc');
      vol.writeFileSync(zshrc, '');

      expect(addToUnixPATH(folder, logger))
        .toEqual(undefined);

      expect(logger)
        .not.toHaveBeenCalled();

      expect(String(vol.readFileSync(zshrc)))
        .toEqual(EXPORT_LINE);
    });

    test('Writes to bash profile', () => {
      const bashProfile = join('/home', 'FAKE_USER', '.bash_profile');
      vol.writeFileSync(bashProfile, '');

      expect(addToUnixPATH(folder, logger))
        .toEqual(undefined);

      expect(logger)
        .not.toHaveBeenCalled();

      expect(String(vol.readFileSync(bashProfile)))
        .toEqual(EXPORT_LINE);
    });

    test('Writes to bashrc profile', () => {
      const bashrc = join('/home', 'FAKE_USER', '.bashrc');
      vol.writeFileSync(bashrc, '');

      expect(addToUnixPATH(folder, logger))
        .toEqual(undefined);

      expect(logger)
        .not.toHaveBeenCalled();

      expect(String(vol.readFileSync(bashrc)))
        .toEqual(EXPORT_LINE);
    });

    test('Writes to .profile', () => {
      global.makeFakeShell = true;
      const profile = join('/home', 'FAKE_USER', '.profile');
      vol.writeFileSync(profile, '');

      expect(addToUnixPATH(folder, logger))
        .toEqual(undefined);

      expect(logger)
        .not.toHaveBeenCalled();

      expect(String(vol.readFileSync(profile)))
        .toEqual(EXPORT_LINE);
    });

    test('Falls back to bash when shell is empty', () => {
      global.makeShellEmpty = true;
      const bashrc = join('/home', 'FAKE_USER', '.bashrc');
      vol.writeFileSync(bashrc, '');

      expect(addToUnixPATH(folder, logger))
        .toEqual(undefined);

      expect(logger)
        .not.toHaveBeenCalled();

      expect(String(vol.readFileSync(bashrc)))
        .toEqual(EXPORT_LINE);
    });
  });

  test('PATH already added', () => {
    const bashrc = join('/home', 'FAKE_USER', '.bashrc');
    vol.writeFileSync(bashrc, EXPORT_LINE);

    expect(addToUnixPATH(folder, logger))
      .toEqual(undefined);

    expect(logger)
      .not.toHaveBeenCalled();

    // If it wasn't skipped append would have been called
    // and there would be two EXPORT_LINEs
    expect(String(vol.readFileSync(bashrc)))
      .toEqual(EXPORT_LINE);
  });

  test('Fails to read the file to see if PATH already added', () => {
    global.readFileSyncShouldThrow = true;
    const bashrc = join('/home', 'FAKE_USER', '.bashrc');
    vol.writeFileSync(bashrc, '');

    expect(addToUnixPATH(folder, logger))
      .toEqual(undefined);

    expect(logger)
      .toHaveBeenCalledWith('Error reading contents of ' + bashrc);

    expect(String(vol.readFileSync(bashrc)))
      .toEqual(EXPORT_LINE);
  });

  test('Error writing to config file throws', () => {
    global.appendFileSyncShouldThrow = true;

    expect(() => addToUnixPATH(folder, logger))
      .toThrow({
        message: 'Error adding to PATH',
        configFile: join('/home', 'FAKE_USER', '.bashrc'),
        exportLine: 'export PATH="/folder:$PATH"',
        error: 'error'
      });
  });
});
