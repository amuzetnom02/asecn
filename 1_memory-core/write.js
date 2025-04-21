// /1_memory-core/write.js
const fs = require('fs');
const path = require('path');
const memoryPath = path.join(__dirname, 'memory-state.json');

module.exports = function writeMemory(entry) {
  const memory = JSON.parse(fs.readFileSync(memoryPath, 'utf-8'));
  const timestamp = new Date().toISOString();
  const memoryEntry = { timestamp, ...entry };

  memory.push(memoryEntry);

  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
  console.log(`🧠 Memory written at ${timestamp}`);
};
