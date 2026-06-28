'use strict';

const fs = require('fs');
const path = require('path');

const STRUCTURE_FILENAME = 'structure.txt';

function getStructureFilePath(baseDir) {
  return path.join(baseDir, STRUCTURE_FILENAME);
}

function structureFileExists(baseDir) {
  const filePath = getStructureFilePath(baseDir);
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function readStructureFileLines(baseDir) {
  const filePath = getStructureFilePath(baseDir);
  const raw = fs.readFileSync(filePath, 'utf8');
  return raw.split(/\r?\n/);
}

module.exports = {
  STRUCTURE_FILENAME,
  getStructureFilePath,
  structureFileExists,
  readStructureFileLines
};
