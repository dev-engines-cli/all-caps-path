# all-caps-path

A Node.js library to add/remove folders to the system environment PATH (or $PATH).

* Cross-Platform
* MIT Licensced
* 100% test coverage
* Source is JavaScript, no binaries used (except the built-in PowerShell.exe on Windows)


## WIP: Tasks

This project is not finished yet.

**Remaining tasks:**

* [x] Project setup (lint/tests/CI)
* [ ] addToPATH
  * [ ] Windows functionality/tests
  * [ ] Unix functionality/tests
* [ ] existsInPATH functionality
  * [ ] Windows functionality/tests
  * [ ] Unix functionality/tests
* [ ] removeFromPATH functionality
  * [ ] Windows functionality/tests
  * [ ] Unix functionality/tests
* [ ] Publishing
  * [ ] `package.json` library publishing adjustments
  * [ ] GH Release/Publish to npm


## Install

* `npm install --save all-caps-path`

Then import the functions as needed:

```js
import {
  addToPATH,
  existsInPATH,
  removeFromPATH
} from 'all-caps-path';
```


## API


## `existsInPATH`

Use the **synchronous** `existsInPATH` function to check if a folder is in the PATH.

Returns a boolean or throws an error.

```js
import { join } from 'node:path';

import { existsInPATH } from 'all-caps-path';

const myFolder = join(process.cwd(), 'my-folder');

let alreadyAdded;
try {
  alreadyAdded = existsInPATH(myFolder);
} catch (error) {
  console.log('Error checking for existence in PATH.', { myFolder, error });
}

if (alreadyAdded) {
  console.log('my-folder is in the PATH');
} else {
  console.log('my-folder is not in the PATH');
}
```


### `addToPATH`

To add a folder to the user's PATH, use the **asynchronous** `addToPATH` function.

You do not need to check if the folder already exists on the PATH, we will do this check
first internally, and return early if it already exists.

```js
import { join } from 'node:path';

import { addToPATH } from 'all-caps-path';

// .then example
const chainedExample = function () {
  const myFolder = join(process.cwd(), 'my-folder');
  addToPATH(myFolder)
    .then(() => {
      console.log('Done.');
    })
    .catch((error) => {
      console.log('Error adding folder to PATH.', { myFolder, error });
    });
};

// async/await example
const asyncAwaitExample = async function () {
  const myFolder = join(process.cwd(), 'my-folder');
  try {
    await addToPATH(myFolder);
  } catch (error) {
    console.log('Error adding folder to PATH.', { myFolder, error });
  }
  console.log('Done.');
};
```


### `removeFromPATH`

To remove a folder from the user's PATH, use the **asynchronous** `removeFromPATH` function.

You do not need to check if the folder already exists on the PATH, we will do this check
first internally, and return early if it does not exist.

```js
import { join } from 'node:path';

import { removeFromPATH } from 'all-caps-path';

// .then example
const chainedExample = function () {
  const myFolder = join(process.cwd(), 'my-folder');
  removeFromPATH(myFolder)
    .then(() => {
      console.log('Done.');
    })
    .catch((error) => {
      console.log('Error adding folder to PATH.', { myFolder, error });
    });
};

// async/await example
const asyncAwaitExample = async function () {
  const myFolder = join(process.cwd(), 'my-folder');
  try {
    await removeFromPATH(myFolder);
  } catch (error) {
    console.log('Error adding folder to PATH.', { myFolder, error });
  }
  console.log('Done.');
};
```


* * *


## Running locally

1. Clone/download/fork repo
1. `npm i`
1. `npm t` to run tests
1. `npm run lint` to run linter
1. `npm run fix` to auto-fix lint violations


* * *

## Alternatives

* https://github.com/ritch/paths
  * Published 2012
  * Only does Unix-based systems
  * Just updates the ~/.profile
  * Uses CJS
* https://github.com/MarkTiedemann/win-path
  * Published 2017
  * Only does Windows systems
  * Requires PowerShell already in PATH
  * Uses CJS
* https://git.rootprojects.org/root/pathman/src/branch/master/npm
  * Published 2019, last update 2023
  * Downloads a binary to add/remove from the PATH for you.
  * Ran as a CLI, not as JS functions
  * The binary source code is written in GO.
  * Unix PATHs are stored in `~/.config/envman/PATH.sh`
  * Windows PATHs are stored in the registry
