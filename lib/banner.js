'use strict';

function clearScreen() {
  process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
}

function printMainBanner() {
  const banner = [
    '=========================================',
    '||                                     ||',
    '||             F I L E M A K E R        ||',
    '||      Cross-Platform Scaffold Tool    ||',
    '||                                     ||',
    '========================================='
  ];
  console.log(banner.join('\n'));
  console.log('');
}

function printSectionHeader(title) {
  const line = '-----------------------------------------';
  console.log(line);
  console.log(`  ${title}`);
  console.log(line);
}

function printExitMessage() {
  console.log('');
  console.log('-----------------------------------------');
  console.log('  Closing safely... Take care!');
  console.log('-----------------------------------------');
}

module.exports = {
  clearScreen,
  printMainBanner,
  printSectionHeader,
  printExitMessage
};
