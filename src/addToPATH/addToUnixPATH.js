/**
 * @file Logic related to adding a folder to the PATH for each OS.
 */

import {
  appendFileSync,
  readFileSync
} from 'node:fs';
import {
  homedir,
  userInfo
} from 'node:os';
import { join } from 'node:path';

import { exists } from '../helpers.js';

/** @typedef {import('./types').LOGGER} LOGGER */

/**
 * Checks the current shell and looks for ZSH/BASH/Profile
 * files, returns best guess for where to add PATH exports.
 *
 * @param  {LOGGER} logger  Function for error logging
 * @return {string}         Path to the config file
 */
const getUnixConfigFile = function (logger) {
  const home = homedir();
  const shell = userInfo().shell || '/bin/bash';
  let configFile = join(home, '.profile');
  if (
    process.env.ZSH_VERSION ||
    shell.includes('zsh')
  ) {
    configFile = join(home, '.zshrc');
  } else if (shell.includes('bash')) {
    const bashProfile = join(home, '.bash_profile');
    // For osx, prefer .bash_profile, fallback to .bashrc
    if (exists(bashProfile, logger)) {
      configFile = bashProfile;
    } else {
      configFile = join(home, '.bashrc');
    }
  }
  return configFile;
};

/**
 * Checks if a config file already contains the PATH export.
 *
 * @param  {string}  configFile  Path to the shell config file
 * @param  {string}  exportLine  The PATH export line to look for
 * @param  {LOGGER}  logger      Error handling function
 * @return {boolean}             true = already in the file
 */
const checkIfAlreadyAdded = function (configFile, exportLine, logger) {
  let alreadyAdded = false;
  if (exists(configFile, logger)) {
    let contents = '';
    try {
      contents = readFileSync(configFile, 'utf-8');
    } catch {
      logger('Error reading contents of ' + configFile);
    }
    alreadyAdded = contents.includes(exportLine);
  }
  return alreadyAdded;
};

/**
 * Add the folder to the user's PATH for Unix based systems.
 *
 * @param {string} folder  The folder to add to the PATH
 * @param {LOGGER} logger  Function to handle logging
 */
export const addToUnixPATH = function (folder, logger) {
  const configFile = getUnixConfigFile(logger);
  const exportLine = 'export PATH="' + folder + ':$PATH"';

  if (checkIfAlreadyAdded(configFile, exportLine, logger)) {
    // PATH already added to configFile, silently return early
    return;
  }

  try {
    appendFileSync(configFile, '\n' + exportLine + '\n');
    // Successfully add PATH export to config, silently return
    return;
  } catch (error) {
    throw {
      message: 'Error adding to PATH',
      configFile,
      exportLine,
      error
    };
  }
};
