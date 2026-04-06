/**
 * @file Logic related to adding a folder to the PATH for each OS.
 */

import { platform } from 'node:os';

import {
  ALLOWED_SHELLS,
  exists
} from '../helpers.js';

import { addToUnixPATH } from './addToUnixPATH.js';
import { addToWindowsPATH } from './addToWindowsPATH.js';

/** @typedef {import('../types').LOGGER} LOGGER */
/** @typedef {import('../types').SHELL} SHELL */

/**
 * Synchronously adds a folder to the PATH.
 *
 * @param {string} folder    The folder to add to the PATH
 * @param {LOGGER} [logger]  Optional function to handle logging
 * @param {SHELL}  [shell]   Explicitly defined shell config to use
 */
export const addToPATH = function (folder, logger, shell) {
  if (typeof(logger) !== 'function') {
    logger = console.log;
  }
  if (typeof(folder) !== 'string') {
    logger('addToPATH requires `folder` to be a string. Aborting.');
    return;
  }
  if (shell && !ALLOWED_SHELLS.includes(shell)) {
    logger(
      'addToPATH requires `shell` to be undefined or one of the following: ' +
      ALLOWED_SHELLS.join(', ')
    );
    shell = undefined;
  }
  if (!exists(folder)) {
    logger('addToPATH requires `folder` to be a file path that exists. Aborting.');
    return;
  }
  if (platform().startsWith('win')) {
    addToWindowsPATH(folder, logger);
  } else {
    addToUnixPATH(folder, logger, shell);
  }
};
