const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "memory-log.json");

function purgeOldMemory(cutoffDateISO) {
  const log = JSON.parse(fs.readFileSync(logPath, "utf8"));
  const cutoff = new Date(cutoffDateISO);
  const filtered = log.filter(entry => new Date(entry.timestamp) >= cutoff);
  fs.writeFileSync(logPath, JSON.stringify(filtered, null, 2));
}

module.exports = purgeOldMemory;
