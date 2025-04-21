// Handles vault logic and interactions with the treasury system
const fs = require('fs');
const balanceState = require('./balance-state.json');
const txHistory = require('./tx-history.json');

module.exports = {
  deposit: function(amount, token = 'ETH') {
    console.log(`Depositing ${amount} ${token} into the vault...`);
    balanceState[token] = (balanceState[token] || 0) + amount;
    txHistory.push({
      action: 'deposit',
      amount,
      token,
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync('./balance-state.json', JSON.stringify(balanceState, null, 2));
    fs.writeFileSync('./tx-history.json', JSON.stringify(txHistory, null, 2));
  },
  withdraw: function(amount, token = '
