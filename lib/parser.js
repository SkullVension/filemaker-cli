'use strict';

const KNOWN_FILES_NO_EXTENSION = new Set([
  'license',
  'licence',
  'dockerfile',
  'makefile',
  'readme',
  'changelog',
  'authors',
  'contributing',
  'procfile',
  'vagrantfile',
  'jenkinsfile',
  'rakefile',
  'gemfile'
]);

function classifyEntry(rawEntry) {
  const trimmed = rawEntry.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.endsWith('/') || trimmed.endsWith('\\')) {
    return {
      name: trimmed.replace(/[/\\]+$/, ''),
      type: 'DIR'
    };
  }

  const isLeadingDot = trimmed.startsWith('.');
  const nameForCheck = isLeadingDot ? trimmed.slice(1) : trimmed;
  const hasExtension = /\.[^.]+$/.test(nameForCheck);

  if (isLeadingDot) {
    return { name: trimmed, type: 'FILE' };
  }

  if (hasExtension) {
    return { name: trimmed, type: 'FILE' };
  }

  const baseName = trimmed.split(/[/\\]/).pop().toLowerCase();
  if (KNOWN_FILES_NO_EXTENSION.has(baseName)) {
    return { name: trimmed, type: 'FILE' };
  }

  return { name: trimmed, type: 'DIR' };
}

function parseCommaList(input) {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map(classifyEntry)
    .filter(Boolean);
}

function parseLines(lines) {
  return lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map(classifyEntry)
    .filter(Boolean);
}

module.exports = {
  classifyEntry,
  parseCommaList,
  parseLines
};
