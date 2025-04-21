// Placeholder for time.jsfunction nowISO() {
  return new Date().toISOString();
}

function timestamp() {
  return Date.now();
}

module.exports = { nowISO, timestamp };
