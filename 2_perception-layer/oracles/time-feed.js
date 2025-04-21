// /oracles/time-feed.js
module.exports = function getTimeSignal() {
  const now = new Date();
  return {
    type: 'time',
    timestamp: now.toISOString(),
    hour: now.getHours(),
    day: now.getDay(),
  };
};
