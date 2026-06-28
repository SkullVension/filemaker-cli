'use strict';

const pkg = require('../package.json');

const HELP_TEXT = `
filemaker v${pkg.version}

Scaffold files and folders in seconds, right from your terminal.

USAGE
  filemaker              Build from structure.txt if present, otherwise prompt
  filemaker --dry-run     Show what would be built without touching disk
  filemaker --version     Print the installed version
  filemaker --help        Show this help message

HOW IT WORKS
  Run filemaker inside any folder. If a structure.txt file exists there,
  it gets read line by line and everything in it gets built automatically.
  No structure.txt? You'll be asked what to build, comma separated.

STRUCTURE.TXT FORMAT
  src/
  src/index.js
  .env
  .gitignore
  README.md

  One entry per line. A trailing slash always means a folder. Anything
  starting with a dot is always a file. Anything else with a dot in the
  name is treated as a file too. Everything else is a folder.

EXAMPLES
  filemaker
  filemaker --dry-run
`;

function parseArgs(argv) {
  const flags = {
    help: false,
    version: false,
    dryRun: false
  };

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') flags.help = true;
    if (arg === '--version' || arg === '-v') flags.version = true;
    if (arg === '--dry-run' || arg === '-d') flags.dryRun = true;
  }

  return flags;
}

function printHelp() {
  console.log(HELP_TEXT);
}

function printVersion() {
  console.log(pkg.version);
}

module.exports = {
  parseArgs,
  printHelp,
  printVersion
};
