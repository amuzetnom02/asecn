// /1_memory-core/purge.js
const fs = require('fs');
const path = require('path');
const memoryPath = path.join(__dirname, 'memory-state.json');

module.exports = function purgeMemory() {
  fs.writeFileSync(memoryPath, '[]');
  console.log('🧼 Memory wiped clean.');
};
