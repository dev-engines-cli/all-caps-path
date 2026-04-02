/**
 * @file Logic related to adding a folder to the PATH for each OS.
 */

/**
 * Reference existing library implementations:
 *
 * https://github.com/ritch/paths
 * Only does Unix, last update 2012, just updates the ~/.profile, uses CJS
 *
 * https://git.rootprojects.org/root/pathman/src/branch/master/npm
 * Just downloads a binary to add/remove from the PATH for you. The source code is actually GO.
 *
 * https://github.com/MarkTiedemann/win-path
 * Only does Windows, requires powershell already in PATH (should be fine), uses CJS, published 2017
 */

/*
import {
  appendFileSync,
  existsSync,
  readFileSync
} from 'node:fs';
*/
import {
  // homedir,
  platform
} from 'node:os';
// import { join } from 'node:path';

/**
 * Add the folder to the user's PATH for Windows systems.
 *
 * @param {string} folder  The folder to add to the PATH
 */
const addToWindowsPATH = function (folder) {
  console.log('STUB: Windows', folder);
};

/**
 * Add the folder to the user's PATH for Unix based systems.
 *
 * @param {string} folder  The folder to add to the PATH
 */
const addToUnixPATH = function (folder) {
  console.log('STUB: Unix', folder);
  /*
  const home = state.homeDirectory;
  const shell = process.env.SHELL || '/bin/bash';
  let configFile;
  if (shell.includes('zsh')) {
    configFile = join(home, '.zshrc');
  } else if (shell.includes('bash')) {
    // For osx, prefer .bash_profile, fallback to .bashrc
    configFile = join(home, '.bashrc');
    if (existsSync(join(home, '.bash_profile'))) {
      configFile = join(home, '.bash_profile');
    }
  } else {
    configFile = join(home, '.profile');
  }
  */
};

/**
 * Asynchronously adds a folder to the PATH.
 *
 * @param {string} folder  The folder to add to the PATH
 */
export const addToPATH = function (folder) {
  if (platform() === 'win32') {
    addToWindowsPATH(folder);
  } else {
    addToUnixPATH(folder);
  }

  /*
  // OSX/Linux: Find config file
  const home = homedir();


  const exportLine = `\n# devEngines\nexport PATH="${shimsDir}:$PATH"\n`;
  console.log('exportLine', exportLine);

  // Check if already added
  if (existsSync(configFile)) {
    const content = readFileSync(configFile, 'utf-8');
    if (content.includes('devEngines')) {
      console.log('PATH already configured in:', configFile);
      return;
    }
  }

  appendFileSync(configFile, exportLine);
  console.log('Added to PATH in:', configFile);
  console.log('\nRestart your terminal or run:');
  console.log(`  source ${configFile}`);
  */
};
