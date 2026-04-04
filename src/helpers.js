/**
 * @file Reusable helper functions.
 */

import { existsSync } from 'node:fs';

/** @typedef {import('./types').LOGGER} LOGGER */

/**
 * Helper function for checking if a file exists,
 * with error handling.
 *
 * @param  {string}  file    Path the file to check for
 * @param  {LOGGER}  logger  Function for error handling
 * @return {boolean}         true = exists
 */
export const exists = function (file, logger) {
  let fileExists = false;
  try {
    fileExists = existsSync(file);
  } catch {
    logger('Error checking existence of ' + file);
  }
  return fileExists;
};
