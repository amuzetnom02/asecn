// /oracles/eth-usd-price.js
module.exports = function fetchEthPrice() {
  // Mocked price feed
  return { symbol: 'ETH-USD', price: 3200, timestamp: new Date().toISOString() };
};
