const fs = require('fs');
const treasuryConfig = require('./treasury-config.json');
const { getBalance, addFunds, distributeIncome, updateBalanceState } = require('./utils/treasury-utils');

// Function to check and update treasury
const updateTreasury = async () => {
  try {
    const currentBalance = await getBalance(treasuryConfig.vaultAddress);
    
    // Update balance state
    await updateBalanceState(currentBalance);

    // Calculate reserves based on the config
    const reserveAmount = (currentBalance * treasuryConfig.reservePercent) / 100;
    const remainingFunds = currentBalance - reserveAmount;

    console.log(`Current balance: ${currentBalance}`);
    console.log(`Reserve amount: ${reserveAmount}`);
    console.log(`Remaining funds: ${remainingFunds}`);

    // Distribute funds according to the strategies
    await distributeIncome(remainingFunds, treasuryConfig.incomeStrategies);
    console.log('Funds successfully distributed.');

    // Example of adding new funds to treasury
    await addFunds(treasuryConfig.vaultAddress, 50); // Adding 50 ETH for example

  } catch (err) {
    console.error('Error updating treasury:', err);
  }
};

// Run update treasury function periodically
setInterval(updateTreasury, treasuryConfig.auditInterval);
