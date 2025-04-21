// Writes a birth memory entry to memory-core
const fs = require('fs');
module.exports = function writeBirthMemory() {
  const entry = {
    message: "I am born.",
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync("../1_memory-core/memory-log.json", JSON.stringify(entry, null, 2));
};
