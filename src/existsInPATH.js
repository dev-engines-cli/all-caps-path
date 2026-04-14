/**
 * @file Logic relating to checking if a folder is in the PATH.
 */

import { execSync } from 'node:child_process';
import { platform } from 'node:os';

/** @typedef {import('./types').LOGGER} LOGGER */

/**
 * Gets an array of folders from the registry on Windows representing
 * the System PATH. May throw if error accessing Windows Registry.
 *
 * @param  {LOGGER}   logger  Function to handle logging
 * @return {string[]}         Array of folders in the Windows System PATH
 */
export const getWindowsSystemPATHFromRegistry = function (logger) {
  const locationOfSystemPATHInRegistry = [
    'HKLM',
    'SYSTEM',
    'CurrentControlSet',
    'Control',
    'Session Manager',
    'Environment'
  ].join('\\');
  const registryCommand = 'reg query "' + locationOfSystemPATHInRegistry + '" /v Path';

  let registryPATHResponse = '';
  try {
    registryPATHResponse = String(execSync(registryCommand));
  } catch (error) {
    logger('Error reading PATH data from Windows Registry.', error);
    throw error;
  }

  // '\r\nHKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment\r\n    Path    ' +
  // 'REG_EXPAND_SZ    C:\\WINDOWS;%USERPROFILE%\\.example;\r\n\r\n'
  /* v8 ignore next */
  const fullSystemPATH = registryPATHResponse
    // ['\r\nHKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment\r\n    Path    ',
    // '    C:\\WINDOWS;%USERPROFILE%\\.example;\r\n\r\n']
    ?.split('REG_EXPAND_SZ')
    // '    C:\\WINDOWS;%USERPROFILE%\\.example;\r\n\r\n'
    ?.[1] || '';

  const foldersInSystemPATH = fullSystemPATH
    // 'C:\\WINDOWS;%USERPROFILE%\\.example;'
    ?.trim()
    // ['C:\\WINDOWS', '%USERPROFILE%\\.example', '']
    ?.split(';')
    // ['C:\\WINDOWS', '%USERPROFILE%\\.example']
    ?.filter(Boolean);

  return foldersInSystemPATH;
};

/**
 * Checks if a given folder is in the Windows System PATH.
 * May throw if error accessing Windows Registry.
 *
 * @param  {string} folder  The folder to add to the PATH
 * @param  {LOGGER} logger  Function to handle logging
 * @return {boolean}        true = found folder in the PATH
 */
export const folderExistsInWindowsSystemPATH = function (folder, logger) {
  let foldersInSystemPATH = [];
  try {
    foldersInSystemPATH = getWindowsSystemPATHFromRegistry(logger);
  } catch (error) {
    throw error;
  }
  return foldersInSystemPATH.includes(folder);
}

/**
 * Synchronously checks if a folder is in the PATH.
 * May throw.
 *
 * @param  {string}  folder  The folder to add to the PATH
 * @param  {LOGGER}  logger  Function to handle logging
 * @return {boolean}         true = exists on the PATH
 */
export const existsInPATH = function (folder, logger) {
  if (platform().startsWith('win')) {
    return folderExistsInWindowsSystemPATH(folder, logger);
  }
  return false;
};
