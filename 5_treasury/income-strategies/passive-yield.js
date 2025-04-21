// Handles passive income yield generation (e.g., staking, farming)
const fs = require('fs');
const balanceState = require('../balance-state.json');
const txHistory = require('../tx-history.json');

module.exports = {
  generateYield: function(amount, yieldRate = 0.05, token = 'ETH') {
    console.log(`Generating ${yieldRate * 100}% yield on ${amount} ${token}...`);
    const yieldAmount = amount * yieldRate;
    balanceState[token] = (balanceState[token] || 0) + yieldAmount;
    txHistory.push({
      action: 'passive-yield',
      amount: yieldAmount,
      token,
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync('../balance-state.json', JSON.stringify(balanceState, null, 2));
    fs.writeFileSync('../tx-history.json', JSON.stringify(txHistory, null, 2));
  }
};
