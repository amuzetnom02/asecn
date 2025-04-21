const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '..', '1_memory-core', 'memory-log.json');

function log(entry) {
  const time = new Date().toISOString();
  const data = { time, ...entry };

  let logs = [];
  if (fs.existsSync(LOG_PATH)) {
    logs = JSON.parse(fs.readFileSync(LOG_PATH));
  }
  logs.push(data);
  fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));
}

module.exports = log;
