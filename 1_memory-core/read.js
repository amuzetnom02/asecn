// /1_memory-core/read.js
const fs = require('fs');
const path = require('path');
const memoryPath = path.join(__dirname, 'memory-state.json');

module.exports = function readMemory() {
  const memory = JSON.parse(fs.readFileSync(memoryPath, 'utf-8'));
  return memory;
};
