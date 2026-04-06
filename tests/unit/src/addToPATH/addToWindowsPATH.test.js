import { execSync } from 'node:child_process';

import { addToWindowsPATH } from '@/addToPATH/addToWindowsPATH.js';

vi.mock('node:child_process', () => {
  return {
    execSync: vi.fn()
  };
});

const error = 'error';
const mockedExecSync = vi.mocked(execSync);
const registryResponse = (folder) => {
  folder = folder || '';
  return (
    '\r\n' +
    'HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment' +
    '\r\n' +
    '    Path    REG_EXPAND_SZ    C:\\WINDOWS;%USERPROFILE%\\.example;' + folder +
    '\r\n\r\n'
  );
}

describe('addToWindowsPATH', () => {
  const folder = 'C:\\folder';
  const logger = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Reading PATH from registry fails', () => {
    mockedExecSync.mockThrow(error);
    addToWindowsPATH(folder, logger);

    expect(logger)
      .toHaveBeenCalledWith('Error reading PATH data from Windows Registry.', error);
  });

  test('Returns early if folder exists on PATH', () => {
    mockedExecSync
      .mockReturnValueOnce(registryResponse(folder))
      .mockThrow(error);
    addToWindowsPATH(folder, logger);

    expect(logger)
      .not.toHaveBeenCalled();
  });

  test('Logs specific message about running as admin', () => {
    mockedExecSync
      .mockReturnValueOnce(registryResponse())
      .mockThrow(new Error('ERROR: Access to the registry path is denied.'));
    addToWindowsPATH(folder, logger);

    expect(logger)
      .toHaveBeenCalledWith(
        'Adding a folder to the PATH requires administrator privileges to edit the registry.\n' +
        'Try again using "Run as administrator".'
      );
  });

  test('Logs non-specific error when setx fails', () => {
    mockedExecSync
      .mockReturnValueOnce(registryResponse())
      .mockThrow(error);
    addToWindowsPATH(folder, logger);

    expect(logger)
      .toHaveBeenCalledWith('Error adding folder to PATH', error);
  });

  test('Runs without failures', () => {
    mockedExecSync
      .mockReturnValueOnce(registryResponse())
      .mockReturnValueOnce(undefined);
    addToWindowsPATH(folder, logger);

    expect(logger)
      .toHaveBeenCalledWith('Folder added to PATH, restart terminals/shells/command prompts to access folder in PATH.');
  });
});
