/**
 * @file Logic related to adding a folder to the Windows PATH.
 */

import { execSync } from 'node:child_process';

/** @typedef {import('../types').LOGGER} LOGGER */

/**
 * Add the folder to the user's PATH for Windows systems.
 *
 * @param {string} folder  The folder to add to the PATH
 * @param {LOGGER} logger  Function to handle logging
 */
export const addToWindowsPATH = function (folder, logger) {
  const registryPATHLocation = [
    'HKLM',
    'SYSTEM',
    'CurrentControlSet',
    'Control',
    'Session Manager',
    'Environment'
  ].join('\\');
  const registryCommand = 'reg query "' + registryPATHLocation + '" /v Path';

  let registryPATHResponse = '';
  try {
    registryPATHResponse = String(execSync(registryCommand));
  } catch (error) {
    logger('Error reading PATH data from Windows Registry.');
    logger(error);
  }

  // '\r\nHKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment\r\n    Path    '
  // 'REG_EXPAND_SZ    C:\\WINDOWS;%USERPROFILE%\\.example;\r\n\r\n'
  const fullSystemPATH = registryPATHResponse
    // ['\r\nHKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment\r\n    Path    ',
    // '    C:\\WINDOWS;%USERPROFILE%\\.example;\r\n\r\n']
    .split('REG_EXPAND_SZ')
    // '    C:\\WINDOWS;%USERPROFILE%\\.example;\r\n\r\n'
    [1]
    // 'C:\\WINDOWS;%USERPROFILE%\\.example;'
    .trim()
    // ['C:\\WINDOWS', '%USERPROFILE%\\.example', '']
    .split(';')
    // ['C:\\WINDOWS', '%USERPROFILE%\\.example']
    .filter(Boolean);

  // Return early if the folder to add to the PATH is already on the PATH
  if (fullSystemPATH.includes(folder)) {
    return;
  }

  const newSystemPATH = [
    folder,
    ...fullSystemPATH
  ].join(';');

  let errorOccurred = false;
  try {
    // Replace the system PATH
    execSync('setx PATH "' + newSystemPATH + '" /M');
  } catch (error) {
    errorOccurred = true;
    if (error?.message?.includes('Access to the registry path is denied.')) {
      logger(
        'Adding a folder to the PATH requires administrator privileges to edit the registry.\n' +
        'Try again using "Run as administrator".'
      );
    } else {
      logger(error.message);
    }
  }
  if (!errorOccurred) {
    logger('Folder added to PATH, restart terminals/shells/command prompts to access folder in PATH.');
  }
};
