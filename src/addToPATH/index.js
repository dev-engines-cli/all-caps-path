/**
 * @file Logic related to adding a folder to the PATH for each OS.
 */

import { platform } from 'node:os';

import { exists } from '../helpers.js';

import { addToUnixPATH } from './addToUnixPATH.js';
import { addToWindowsPATH } from './addToWindowsPATH.js';

/** @typedef {import('../types').LOGGER} LOGGER */

/**
 * Synchronously adds a folder to the PATH.
 *
 * @param {string} folder    The folder to add to the PATH
 * @param {LOGGER} [logger]  Optional function to handle logging
 */
export const addToPATH = function (folder, logger) {
  if (typeof(logger) !== 'function') {
    logger = console.log;
  }
  if (typeof(folder) !== 'string') {
    logger('addToPATH requires `folder` to be a string. Aborting.');
    return;
  }
  if (!exists(folder)) {
    logger('addToPATH requires `folder` to be a file path that exists. Aborting.');
    return;
  }
  if (platform() === 'win32') {
    addToWindowsPATH(folder, logger);
  } else {
    addToUnixPATH(folder, logger);
  }
};
