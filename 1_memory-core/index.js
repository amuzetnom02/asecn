// /1_memory-core/index.js
const write = require('./write');
const read = require('./read');
const purge = require('./purge');
const recall = require('./recall');

module.exports = {
  writeMemory: write,
  readMemory: read,
  purgeMemory: purge,
  recallMemory: recall,
};
