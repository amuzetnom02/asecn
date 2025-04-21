/**
 * send-funds.js - Handles blockchain transactions for ASECN
 * 
 * This actuator is responsible for sending funds (ETH and ERC20 tokens)
 * to specified addresses. It handles transaction building, signing,
 * gas estimation, and confirmation monitoring.
 */

const { ethers } = require('ethers');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getWallet, getContract, estimateGasPrice, waitForTransaction } = require('../../8_utilities/blockchain');
const { loadABI } = require('../../8_utilities/abi-loader');
const logger = require('../../8_utilities/logger');

// Transaction history file
const historyPath = path.join(__dirname, '..', 'transaction-history.json');
let transactionHistory = [];

// Initialize history if exists
try {
  if (fs.existsSync(historyPath)) {
    transactionHistory = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  } else {
    fs.writeFileSync(historyPath, JSON.stringify(transactionHistory, null, 2));
  }
} catch (error) {
  logger.log({
    type: 'error',
    source: 'send-funds',
    message: 'Failed to initialize transaction history',
    details: error.message
  });
}

/**
 * Send native ETH to a recipient address
 * 
 * @param {Object} params - Transaction parameters
 * @param {string} params.to - Recipient address
 * @param {string|number} params.amount - Amount in ETH to send
 * @param {string} params.memo - Optional memo/reason for the transaction
 * @param {Object} options - Optional configuration
 * @param {string} options.gasStrategy - Gas price strategy ('slow', 'medium', 'fast')
 * @returns {Promise<Object>} - Transaction result
 */
async function sendEth(params, options = {}) {
  try {
    const { to, amount, memo = '' } = params;
    
    // Validate parameters
    if (!to || !ethers.utils.isAddress(to)) {
      throw new Error('Invalid recipient address');
    }
    
    if (!amount || isNaN(parseFloat(amount))) {
      throw new Error('Invalid amount');
    }
    
    // Convert amount to wei
    const amountWei = ethers.utils.parseEther(amount.toString());
    
    logger.log({
      type: 'info',
      source: 'send-funds',
      message: `Initiating ETH transfer of ${amount} ETH to ${to}`,
      details: { memo, amountWei: amountWei.toString() }
    });
    
    // Get wallet
    const wallet = getWallet();
    
    // Check balance
    const balance = await wallet.getBalance();
    if (balance.lt(amountWei)) {
      throw new Error(`Insufficient balance: ${ethers.utils.formatEther(balance)} ETH available, trying to send ${amount} ETH`);
    }
    
    // Estimate gas price based on strategy
    const gasPrice = await estimateGasPrice(options.gasStrategy || 'medium');
    
    // Prepare transaction
    const tx = await wallet.sendTransaction({
      to,
      value: amountWei,
      gasPrice,
      // Include memo in data field if provided
      data: memo ? ethers.utils.hexlify(ethers.utils.toUtf8Bytes(memo)) : '0x'
    });
    
    logger.log({
      type: 'info',
      source: 'send-funds',
      message: `ETH transfer transaction submitted`,
      details: { txHash: tx.hash }
    });
    
    // Wait for confirmation
    const receipt = await waitForTransaction(
      tx.hash,
      parseInt(process.env.CONFIRMATION_BLOCKS) || 1
    );
    
    // Add to transaction history
    const historyEntry = {
      timestamp: new Date().toISOString(),
      type: 'eth',
      from: wallet.address,
      to,
      amount: amount.toString(),
      amountWei: amountWei.toString(),
      memo,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? 'success' : 'failed'
    };
    
    transactionHistory.push(historyEntry);
    fs.writeFileSync(historyPath, JSON.stringify(transactionHistory, null, 2));
    
    logger.log({
      type: 'success',
      source: 'send-funds',
      message: `ETH transfer successful`,
      details: historyEntry
    });
    
    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    };
    
  } catch (error) {
    logger.log({
      type: 'error',
      source: 'send-funds',
      message: 'ETH transfer failed',
      details: error.message
    });
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send ERC20 tokens to a recipient address
 * 
 * @param {Object} params - Transaction parameters
 * @param {string} params.to - Recipient address
 * @param {string|number} params.amount - Amount of tokens to send (in token units)
 * @param {string} params.tokenAddress - ERC20 token contract address
 * @param {number} params.decimals - Token decimals (default: 18)
 * @param {string} params.memo - Optional memo/reason for the transaction
 * @param {Object} options - Optional configuration
 * @param {string} options.gasStrategy - Gas price strategy ('slow', 'medium', 'fast')
 * @returns {Promise<Object>} - Transaction result
 */
async function sendERC20(params, options = {}) {
  try {
    const { to, amount, tokenAddress, decimals = 18, memo = '' } = params;
    
    // Validate parameters
    if (!to || !ethers.utils.isAddress(to)) {
      throw new Error('Invalid recipient address');
    }
    
    if (!amount || isNaN(parseFloat(amount))) {
      throw new Error('Invalid amount');
    }
    
    if (!tokenAddress || !ethers.utils.isAddress(tokenAddress)) {
      throw new Error('Invalid token contract address');
    }
    
    // Convert amount to token units with decimals
    const amountInTokenUnits = ethers.utils.parseUnits(amount.toString(), decimals);
    
    logger.log({
      type: 'info',
      source: 'send-funds',
      message: `Initiating ERC20 transfer of ${amount} tokens to ${to}`,
      details: { tokenAddress, memo }
    });
    
    // Get ERC20 contract interface
    const tokenContract = getContract(tokenAddress, [
      // Standard ERC20 functions we need
      'function transfer(address to, uint256 amount) returns (bool)',
      'function balanceOf(address owner) view returns (uint256)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)'
    ]);
    
    // Get token symbol and actual decimals if available
    let tokenSymbol = 'UNKNOWN';
    let actualDecimals = decimals;
    try {
      tokenSymbol = await tokenContract.symbol();
      actualDecimals = await tokenContract.decimals();
    } catch (error) {
      // Symbol and decimals are optional in ERC20, continue with defaults
    }
    
    // Check balance
    const wallet = getWallet();
    const balance = await tokenContract.balanceOf(wallet.address);
    if (balance.lt(amountInTokenUnits)) {
      throw new Error(`Insufficient token balance: ${ethers.utils.formatUnits(balance, actualDecimals)} ${tokenSymbol} available, trying to send ${amount} ${tokenSymbol}`);
    }
    
    // Estimate gas price based on strategy
    const gasPrice = await estimateGasPrice(options.gasStrategy || 'medium');
    
    // Prepare and send transaction
    const tx = await tokenContract.transfer(to, amountInTokenUnits, {
      gasPrice
    });
    
    logger.log({
      type: 'info',
      source: 'send-funds',
      message: `ERC20 transfer transaction submitted`,
      details: { txHash: tx.hash, tokenSymbol }
    });
    
    // Wait for confirmation
    const receipt = await waitForTransaction(
      tx.hash,
      parseInt(process.env.CONFIRMATION_BLOCKS) || 1
    );
    
    // Add to transaction history
    const historyEntry = {
      timestamp: new Date().toISOString(),
      type: 'erc20',
      from: wallet.address,
      to,
      amount: amount.toString(),
      amountInTokenUnits: amountInTokenUnits.toString(),
      tokenAddress,
      tokenSymbol,
      decimals: actualDecimals,
      memo,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? 'success' : 'failed'
    };
    
    transactionHistory.push(historyEntry);
    fs.writeFileSync(historyPath, JSON.stringify(transactionHistory, null, 2));
    
    logger.log({
      type: 'success',
      source: 'send-funds',
      message: `ERC20 transfer successful`,
      details: historyEntry
    });
    
    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      tokenSymbol,
      tokenDecimals: actualDecimals
    };
    
  } catch (error) {
    logger.log({
      type: 'error',
      source: 'send-funds',
      message: 'ERC20 transfer failed',
      details: error.message
    });
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get transaction history
 * @returns {Array<Object>} - List of transactions
 */
function getTransactionHistory() {
  return transactionHistory;
}

module.exports = {
  sendEth,
  sendERC20,
  getTransactionHistory
};
