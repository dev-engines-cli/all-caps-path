/**
 * @file Logic related to adding a folder to the Windows PATH.
 */

import { execSync } from 'node:child_process';

import { getWindowsSystemPATHFromRegistry } from '../existsInPATH.js';

/** @typedef {import('../types').LOGGER} LOGGER */

/**
 * Add the folder to the user's PATH for Windows systems.
 *
 * @param {string} folder  The folder to add to the PATH
 * @param {LOGGER} logger  Function to handle logging
 */
export const addToWindowsPATH = function (folder, logger) {
  let foldersInSystemPATH = [];
  try {
    foldersInSystemPATH = getWindowsSystemPATHFromRegistry(logger);
  } catch {
    return;
  }

  // Return early if the folder to add to the PATH is already on the PATH
  if (foldersInSystemPATH?.includes(folder)) {
    return;
  }

  const newSystemPATH = [
    folder,
    ...foldersInSystemPATH
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
      logger('Error adding folder to PATH', error);
    }
  }
  if (!errorOccurred) {
    logger('Folder added to PATH, restart terminals/shells/command prompts to access folder in PATH.');
  }
};
