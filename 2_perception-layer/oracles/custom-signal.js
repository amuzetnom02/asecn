// /oracles/custom-signal.js
module.exports = function customSignal(input) {
  return { type: 'custom', value: input, timestamp: new Date().toISOString() };
};
