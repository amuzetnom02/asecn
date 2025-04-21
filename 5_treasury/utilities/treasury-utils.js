const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const logger = require('../../8_utilities/logger');
const envConfig = require('../../8_utilities/env-config');
const abiLoader = require('../../8_utilities/abi-loader');

/**
 * Get current balance from blockchain for the treasury vault address
 * @param {string} vaultAddress - The treasury vault address
 * @returns {Promise<number>} - The balance in ETH
 */
const getBalance = async (vaultAddress) => {
  try {
    // Load environment configuration
    const config = envConfig.getConfig();
    
    // Configure provider
    let provider;
    if (config.blockchain.infuraApiKey) {
      provider = new ethers.providers.InfuraProvider(
        config.blockchain.network,
        config.blockchain.infuraApiKey
      );
    } else if (config.blockchain.alchemyApiKey) {
      provider = new ethers.providers.AlchemyProvider(
        config.blockchain.network,
        config.blockchain.alchemyApiKey
      );
    } else {
      provider = new ethers.providers.JsonRpcProvider(
        `https://${config.blockchain.network}.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161` // Public fallback key (limited usage)
      );
      logger.warn('Using public fallback provider - not recommended for production');
    }
    
    // Get the balance from the blockchain
    const balance = await provider.getBalance(vaultAddress);
    const balanceInEth = parseFloat(ethers.utils.formatEther(balance));
    
    logger.info(`Treasury balance: ${balanceInEth} ETH`);
    
    // Record balance history
    recordTransaction({
      type: 'BALANCE_CHECK',
      amount: balanceInEth,
      address: vaultAddress,
      timestamp: new Date().toISOString()
    });
    
    return balanceInEth;
  } catch (err) {
    logger.error(`Error fetching balance: ${err.message}`);
    return 0;
  }
};

/**
 * Add funds to the treasury
 * @param {string} vaultAddress - The treasury vault address
 * @param {number} amount - The amount to add in ETH
 * @returns {Promise<Object>} - Transaction result
 */
const addFunds = async (vaultAddress, amount) => {
  try {
    // Load environment configuration
    const config = envConfig.getConfig();
    
    // Check for critical errors
    if (envConfig.hasErrors()) {
      throw new Error(`Cannot add funds due to configuration errors: ${envConfig.getErrors().join(', ')}`);
    }
    
    // Configure provider
    let provider;
    if (config.blockchain.infuraApiKey) {
      provider = new ethers.providers.InfuraProvider(
        config.blockchain.network,
        config.blockchain.infuraApiKey
      );
    } else if (config.blockchain.alchemyApiKey) {
      provider = new ethers.providers.AlchemyProvider(
        config.blockchain.network,
        config.blockchain.alchemyApiKey
      );
    } else {
      provider = new ethers.providers.JsonRpcProvider(
        `https://${config.blockchain.network}.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`
      );
      logger.warn('Using public fallback provider - not recommended for production');
    }
    
    // Create wallet from private key
    if (!config.wallet.privateKey) {
      throw new Error('Wallet private key not configured');
    }
    
    const wallet = new ethers.Wallet(config.wallet.privateKey, provider);
    logger.info(`Using wallet address: ${wallet.address}`);
    
    // Get current gas price based on strategy
    let gasPrice;
    switch (config.gas.priceStrategy) {
      case 'low':
        gasPrice = (await provider.getGasPrice()).mul(80).div(100); // 80% of current gas price
        break;
      case 'high':
        gasPrice = (await provider.getGasPrice()).mul(120).div(100); // 120% of current gas price
        break;
      case 'medium':
      default:
        gasPrice = await provider.getGasPrice(); // 100% of current gas price
    }
    
    // Convert amount to wei
    const amountInWei = ethers.utils.parseEther(amount.toString());
    
    // Prepare transaction
    const tx = {
      to: vaultAddress,
      value: amountInWei,
      gasPrice: gasPrice,
      gasLimit: config.gas.maxGasLimit
    };
    
    // Record transaction attempt
    recordTransaction({
      type: 'FUND_ATTEMPT',
      from: wallet.address,
      to: vaultAddress,
      amount: amount,
      timestamp: new Date().toISOString()
    });
    
    // Send transaction
    logger.info(`Sending ${amount} ETH to treasury at ${vaultAddress}`);
    const txResponse = await wallet.sendTransaction(tx);
    
    logger.info(`Transaction sent: ${txResponse.hash}`);
    
    // Wait for confirmation
    logger.info(`Waiting for ${config.transactions.confirmationBlocks} confirmation blocks...`);
    const receipt = await txResponse.wait(config.transactions.confirmationBlocks);
    
    // Record successful transaction
    recordTransaction({
      type: 'FUND_SUCCESS',
      hash: receipt.transactionHash,
      from: wallet.address,
      to: vaultAddress,
      amount: amount,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      timestamp: new Date().toISOString()
    });
    
    logger.info(`Successfully added ${amount} ETH to treasury`);
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
    
  } catch (err) {
    logger.error(`Failed to add funds to treasury: ${err.message}`);
    
    // Record failed transaction
    recordTransaction({
      type: 'FUND_FAILURE',
      to: vaultAddress,
      amount: amount,
      error: err.message,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Distribute income based on defined strategies
 * @param {number} remainingFunds - Funds to distribute in ETH
 * @param {Object} strategies - Distribution strategies
 * @returns {Promise<Object>} - Distribution result
 */
const distributeIncome = async (remainingFunds, strategies) => {
  try {
    // Calculate distribution amounts
    const donations = remainingFunds * strategies.donations;
    const passiveYield = remainingFunds * strategies.passiveYield;
    const investments = remainingFunds * strategies.investments;
    
    logger.info('Income distribution plan:');
    logger.info(`- Donations: ${donations} ETH`);
    logger.info(`- Passive Yield: ${passiveYield} ETH`);
    logger.info(`- Investments: ${investments} ETH`);
    
    // Record distribution plan
    recordTransaction({
      type: 'DISTRIBUTION_PLAN',
      totalAmount: remainingFunds,
      donations: donations,
      passiveYield: passiveYield,
      investments: investments,
      timestamp: new Date().toISOString()
    });
    
    // Implementation of actual distribution would go here
    // For now, we'll just log the plan and record the intent
    
    // Load donation strategy module
    try {
      const donationStrategy = require('../income-strategies/donations');
      if (donations > 0) {
        await donationStrategy.execute(donations);
      }
    } catch (err) {
      logger.error(`Error in donation strategy: ${err.message}`);
    }
    
    // Load passive yield strategy module
    try {
      const passiveYieldStrategy = require('../income-strategies/passive-yield');
      if (passiveYield > 0) {
        await passiveYieldStrategy.execute(passiveYield);
      }
    } catch (err) {
      logger.error(`Error in passive yield strategy: ${err.message}`);
    }
    
    return {
      success: true,
      distributed: {
        donations,
        passiveYield,
        investments
      }
    };
    
  } catch (err) {
    logger.error(`Error distributing income: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Update the balance state in the balance-state.json file
 * @param {number} newBalance - New balance in ETH
 * @returns {Promise<boolean>} - Success status
 */
const updateBalanceState = async (newBalance) => {
  try {
    const balanceState = {
      currentBalance: newBalance,
      lastUpdated: new Date().toISOString()
    };
    
    // Write the new balance to the balance-state.json file
    const balanceFilePath = path.join(__dirname, '..', 'balance-state.json');
    fs.writeFileSync(balanceFilePath, JSON.stringify(balanceState, null, 2));
    
    logger.info(`Balance state updated to ${newBalance} ETH`);
    return true;
  } catch (err) {
    logger.error(`Error updating balance state: ${err.message}`);
    return false;
  }
};

/**
 * Record transaction in transaction history
 * @param {Object} transaction - Transaction details
 */
function recordTransaction(transaction) {
  try {
    const txHistoryPath = path.join(__dirname, '..', 'tx-history.json');
    let transactions = [];
    
    // Read existing transactions if the file exists
    if (fs.existsSync(txHistoryPath)) {
      const data = fs.readFileSync(txHistoryPath, 'utf8');
      if (data) {
        transactions = JSON.parse(data);
      }
    }
    
    // Add new transaction
    transactions.push(transaction);
    
    // Limit history size to prevent file from growing too large
    if (transactions.length > 1000) {
      transactions = transactions.slice(transactions.length - 1000);
    }
    
    // Write back to file
    fs.writeFileSync(txHistoryPath, JSON.stringify(transactions, null, 2));
  } catch (err) {
    logger.error(`Failed to record transaction: ${err.message}`);
  }
}

module.exports = { getBalance, addFunds, distributeIncome, updateBalanceState };
