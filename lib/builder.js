'use strict';

const fs = require('fs');
const path = require('path');

function ensureDirSync(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function ensureFileSync(targetPath) {
  const dir = path.dirname(targetPath);
  if (dir && dir !== '.') {
    ensureDirSync(dir);
  }
  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, '');
  }
}

function buildEntry(entry, baseDir, dryRun) {
  const targetPath = path.join(baseDir, entry.name);
  const alreadyExists = fs.existsSync(targetPath);

  if (dryRun) {
    return { ...entry, success: true, alreadyExists, dryRun: true };
  }

  try {
    if (entry.type === 'DIR') {
      ensureDirSync(targetPath);
    } else {
      ensureFileSync(targetPath);
    }
    return { ...entry, success: true, alreadyExists };
  } catch (err) {
    return { ...entry, success: false, error: err.message };
  }
}

function buildAll(entries, baseDir, options = {}) {
  const dryRun = Boolean(options.dryRun);
  const results = [];

  for (const entry of entries) {
    const result = buildEntry(entry, baseDir, dryRun);
    results.push(result);

    const label = result.type === 'DIR' ? '[DIR]' : '[FILE]';

    if (!result.success) {
      console.log(`[!] FAILED: ${result.name} -- ${result.error}`);
      continue;
    }

    if (dryRun) {
      const tag = result.alreadyExists ? '[exists]' : '[would create]';
      console.log(`[+] ${label} ${result.name} ${tag}`);
      continue;
    }

    const tag = result.alreadyExists ? '[already there]' : '';
    console.log(`[+] ${label} ${result.name} ${tag}`.trim());
  }

  return results;
}

module.exports = {
  ensureDirSync,
  ensureFileSync,
  buildEntry,
  buildAll
};
