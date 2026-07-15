'use strict';

const path = require('path');

const MIN_NODE_MAJOR = 14;

function checkNodeVersion() {
  const major = parseInt(process.versions.node.split('.')[0], 10);
  if (major < MIN_NODE_MAJOR) {
    console.log(`[!] filemaker needs Node ${MIN_NODE_MAJOR} or newer. You're running Node ${process.versions.node}.`);
    console.log('[!] Please update Node and try again.');
    return false;
  }
  return true;
}

function isPathSafe(baseDir, entryName) {
  const resolvedBase = path.resolve(baseDir);
  const resolvedTarget = path.resolve(baseDir, entryName);

  if (path.isAbsolute(entryName)) {
    return false;
  }

  if (entryName.split(/[/\\]/).includes('..')) {
    return false;
  }

  return resolvedTarget.startsWith(resolvedBase + path.sep) || resolvedTarget === resolvedBase;
}

function filterSafeEntries(entries, baseDir) {
  const safe = [];
  const blocked = [];

  for (const entry of entries) {
    if (isPathSafe(baseDir, entry.name)) {
      safe.push(entry);
    } else {
      blocked.push(entry);
    }
  }

  return { safe, blocked };
}

module.exports = {
  checkNodeVersion,
  isPathSafe,
  filterSafeEntries
};
