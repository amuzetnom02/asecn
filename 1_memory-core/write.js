const fs = require("fs");
const path = require("path");

const statePath = path.join(__dirname, "memory-state.json");
const logPath = path.join(__dirname, "memory-log.json");

function writeMemory(source, data) {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, source, data };

  // Update log
  const log = JSON.parse(fs.readFileSync(logPath, "utf8"));
  log.push(entry);
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

  // Update state
  const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  state.lastUpdated = timestamp;
  state.lastAction = data.event || "unknown";
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

module.exports = writeMemory;
