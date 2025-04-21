// /1_memory-core/recall.js
const read = require('./read');

module.exports = function recallMemory(query = '') {
  const memory = read();
  return memory.filter(entry =>
    JSON.stringify(entry).toLowerCase().includes(query.toLowerCase())
  );
};
