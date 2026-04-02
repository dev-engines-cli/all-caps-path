/**
 * @file Logic for removing folders from paths on each OS.
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

import {
  existsSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import {
  homedir,
  platform
} from 'node:os';
import { join } from 'node:path';

/**
 * Remove the folder from the user's PATH for Windows systems.
 *
 * @param {string} folder  The folder to remove from the PATH
 */
const removeFromWindowsPATH = function (folder) {
  console.log('STUB: Windows');
};

/**
 * Remove the folder from the user's PATH for Unix based systems.
 *
 * @param {string} folder  The folder to remove from the PATH
 */
const removeFromUnixPATH = function (folder) {
  console.log('STUB: Unix');
  /*
  // Check config files
  const home = homedir();
  const configFiles = [
    join(home, '.zshrc'),
    join(home, '.bashrc'),
    join(home, '.bash_profile'),
    join(home, '.profile')
  ];

  for (const configFile of configFiles) {
    if (!existsSync(configFile)) {
      continue;
    }

    const content = readFileSync(configFile, 'utf-8');
    if (content.includes('devEngines')) {
      // Remove the devEngines lines
      const newContent = content
        .split('\n')
        .filter((line) => !line.includes('devEngines'))
        .join('\n');

      writeFileSync(configFile, newContent);
      console.log('Removed from:', configFile);
    }
  }

  console.log('\nRestart your terminal to complete uninstallation.');
  */
};

/**
 * Asynchronously removes a folder from the PATH.
 *
 * @param {string} folder  The folder to remove from the PATH
 */
export const removeFromPATH = function (folder) {
  if (platform() === 'win32') {
    removeFromWindowsPATH(folder);
  } else {
    removeFromUnixPATH(folder);
  }
};
