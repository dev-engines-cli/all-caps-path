/**
 * @file Logic related to adding a folder to the Windows PATH.
 */

/**
 * Reference existing library implementations:
 *
 * https://git.rootprojects.org/root/pathman/src/branch/master/npm
 * Just downloads a binary to add/remove from the PATH for you. The source code is actually GO.
 *
 * https://github.com/MarkTiedemann/win-path
 * Only does Windows, requires powershell already in PATH (should be fine), uses CJS, published 2017
 */

/** @typedef {import('../types').LOGGER} LOGGER */

/**
 * Add the folder to the user's PATH for Windows systems.
 *
 * @param {string} folder  The folder to add to the PATH
 * @param {LOGGER} logger  Function to handle logging
 */
export const addToWindowsPATH = function (folder, logger) {
  logger('STUB: Windows', folder);
};
