#!/usr/bin/env node

'use strict';

const inquirer = require('inquirer');

const { clearScreen, printMainBanner, printSectionHeader, printExitMessage } = require('../lib/banner');
const { parseCommaList, parseLines } = require('../lib/parser');
const { buildAll } = require('../lib/builder');
const { structureFileExists, readStructureFileLines, STRUCTURE_FILENAME } = require('../lib/structureFile');
const { parseArgs, printHelp, printVersion } = require('../lib/cli');
const { checkNodeVersion, filterSafeEntries } = require('../lib/safety');

let exiting = false;
function handleSigint() {
  if (exiting) return;
  exiting = true;
  printExitMessage();
  process.exit(0);
}
process.on('SIGINT', handleSigint);

async function run() {
  const flags = parseArgs(process.argv.slice(2));

  if (flags.help) {
    printHelp();
    return;
  }

  if (flags.version) {
    printVersion();
    return;
  }

  if (!checkNodeVersion()) {
    process.exitCode = 1;
    return;
  }

  const cwd = process.cwd();

  clearScreen();
  printMainBanner();

  if (flags.dryRun) {
    printSectionHeader('Dry run -- nothing will actually be created');
    console.log('');
  }

  let entries = [];

  if (structureFileExists(cwd)) {
    printSectionHeader(`Found ${STRUCTURE_FILENAME} -- building automatically`);
    const lines = readStructureFileLines(cwd);
    entries = parseLines(lines);

    if (entries.length === 0) {
      console.log(`[!] ${STRUCTURE_FILENAME} was found but contained no valid entries.`);
      console.log('[!] Nothing to build. Exiting.');
      return;
    }
  } else {
    printSectionHeader('No structure.txt found -- manual mode');

    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'items',
        message: 'What do you want to build? (Separate items with commas)',
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return 'Please enter at least one file or folder name.';
          }
          return true;
        }
      }
    ]);

    entries = parseCommaList(answer.items);

    if (entries.length === 0) {
      console.log('[!] No valid items were parsed from your input. Exiting.');
      return;
    }
  }

  const { safe, blocked } = filterSafeEntries(entries, cwd);

  if (blocked.length > 0) {
    console.log('');
    console.log(`[!] Skipped ${blocked.length} unsafe entr${blocked.length === 1 ? 'y' : 'ies'} (outside the current folder):`);
    blocked.forEach((entry) => console.log(`[!]   ${entry.name}`));
  }

  if (safe.length === 0) {
    console.log('');
    console.log('[!] Nothing safe left to build. Exiting.');
    return;
  }

  console.log('');
  printSectionHeader(`Building ${safe.length} item(s) in: ${cwd}`);
  console.log('');

  const results = buildAll(safe, cwd, { dryRun: flags.dryRun });

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.length - successCount;

  console.log('');
  printSectionHeader('Summary');
  console.log(`[+] ${flags.dryRun ? 'Would create' : 'Created'}: ${successCount}`);
  if (failCount > 0) {
    console.log(`[!] Failed: ${failCount}`);
  }
  console.log('');
  console.log('Done. Take care!');

  const noFlagsUsed = !flags.dryRun && !flags.help && !flags.version;
  if (noFlagsUsed) {
    console.log('');
    console.log('Tip: run "filemaker --help" to see all available options.');
  }
}

run().catch((err) => {
  console.log('');
  console.log('[!] Something went wrong:');
  console.log(`[!] ${err.message}`);
  process.exit(1);
});
