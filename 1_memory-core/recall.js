const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "memory-log.json");

function recallMemory(filterFn = () => true) {
  const log = JSON.parse(fs.readFileSync(logPath, "utf8"));
  return log.filter(filterFn);
}

module.exports = recallMemory;
