// Handles donation inflows into the vault
const fs = require('fs');
const balanceState = require('../balance-state.json');
const txHistory = require('../tx-history.json');

module.exports = {
  donate: function(donor, amount, token = 'ETH') {
    console.log(`Receiving donation of ${amount} ${token} from ${donor}...`);
    balanceState[token] = (balanceState[token] || 0) + amount;
    txHistory.push({
      action: 'donation',
      donor,
      amount,
      token,
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync('../balance-state.json', JSON.stringify(balanceState, null, 2));
    fs.writeFileSync('../tx-history.json', JSON.stringify(txHistory, null, 2));
  }
};
