// blockchain.js - Core blockchain utilities for ASECN
const { ethers } = require('ethers');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

// Cache for loaded ABIs
const abiCache = {};

/**
 * Initialize blockchain provider based on environment configuration
 * @returns {ethers.providers.Provider} - Ethers provider
 */
function getProvider() {
  const network = process.env.BLOCKCHAIN_NETWORK || 'goerli';
  
  // Try Alchemy first
  if (process.env.ALCHEMY_API_KEY) {
    return new ethers.providers.AlchemyProvider(
      network,
      process.env.ALCHEMY_API_KEY
    );
  }
  
  // Fallback to Infura
  if (process.env.INFURA_API_KEY) {
    return new ethers.providers.InfuraProvider(
      network,
      process.env.INFURA_API_KEY
    );
  }
  
  // Final fallback to default provider
  logger.log({
    level: 'warn',
    message: 'No API keys found, using default provider (rate limited)'
  });
  
  return ethers.getDefaultProvider(network);
}

/**
 * Get a signer wallet that can interact with the blockchain
 * @returns {ethers.Wallet} - Connected wallet instance
 */
function getWallet() {
  const provider = getProvider();
  
  // Using private key from environment
  if (process.env.WALLET_PRIVATE_KEY) {
    return new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  }
  
  // Throw error if no wallet configuration found
  throw new Error('No wallet configuration found. Please set WALLET_PRIVATE_KEY in config.env.');
}

/**
 * Load ABI for a contract
 * @param {string} abiName - Name of the ABI file without .json extension
 * @returns {Array} - Contract ABI
 */
function loadABI(abiName) {
  // Return cached ABI if available
  if (abiCache[abiName]) {
    return abiCache[abiName];
  }
  
  // Path to ABIs directory
  const abiPath = path.join(__dirname, '..', '8_utilities', 'mock_abis', `${abiName}.json`);
  
  try {
    const abiData = fs.readFileSync(abiPath, 'utf8');
    const abi = JSON.parse(abiData);
    
    // Cache the loaded ABI
    abiCache[abiName] = abi;
    
    return abi;
  } catch (error) {
    logger.log({
      level: 'error',
      message: `Failed to load ABI: ${abiName}.json`,
      error: error.message
    });
    throw new Error(`Failed to load ABI: ${abiName}.json`);
  }
}

/**
 * Create contract instance
 * @param {string} address - Contract address
 * @param {string|Array} abi - Contract ABI or name of ABI file
 * @param {boolean} useSigner - Whether to connect with signer
 * @returns {ethers.Contract} - Contract instance
 */
function getContract(address, abi, useSigner = true) {
  // If abi is a string, load the ABI file
  const contractABI = typeof abi === 'string' ? loadABI(abi) : abi;
  
  // Get provider or signer based on requirement
  const signerOrProvider = useSigner ? getWallet() : getProvider();
  
  // Create and return the contract instance
  return new ethers.Contract(address, contractABI, signerOrProvider);
}

/**
 * Estimate gas price based on strategy
 * @param {string} strategy - Gas price strategy ('slow', 'medium', 'fast')
 * @returns {Promise<BigNumber>} - Estimated gas price
 */
async function estimateGasPrice(strategy = 'medium') {
  const provider = getProvider();
  
  try {
    // Get fee data (EIP-1559)
    const feeData = await provider.getFeeData();
    
    // Apply multiplier based on strategy
    let multiplier;
    switch (strategy.toLowerCase()) {
      case 'slow':
        multiplier = 1.0;
        break;
      case 'medium':
        multiplier = 1.5;
        break;
      case 'fast':
        multiplier = 2.0;
        break;
      default:
        multiplier = 1.0;
    }
    
    // Use maxFeePerGas if available (EIP-1559) or fallback to gasPrice
    if (feeData.maxFeePerGas) {
      return feeData.maxFeePerGas.mul(ethers.BigNumber.from(Math.floor(multiplier * 100))).div(100);
    } else {
      return feeData.gasPrice.mul(ethers.BigNumber.from(Math.floor(multiplier * 100))).div(100);
    }
  } catch (error) {
    logger.log({
      level: 'error',
      message: 'Error estimating gas price',
      error: error.message
    });
    
    // Fallback to provider's gasPrice estimation
    return provider.getGasPrice();
  }
}

/**
 * Wait for transaction confirmation
 * @param {string} txHash - Transaction hash
 * @param {number} confirmations - Number of confirmations to wait for
 * @returns {Promise<TransactionReceipt>} - Transaction receipt
 */
async function waitForTransaction(txHash, confirmations = 1) {
  const provider = getProvider();
  
  // Set timeout
  const timeoutDuration = parseInt(process.env.TRANSACTION_TIMEOUT) || 120000;
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Transaction confirmation timeout: ${txHash}`)), timeoutDuration);
  });
  
  // Wait for confirmation
  const confirmation = provider.waitForTransaction(txHash, confirmations);
  
  // Return result of the first to resolve/reject
  return Promise.race([confirmation, timeout]);
}

module.exports = {
  getProvider,
  getWallet,
  loadABI,
  getContract,
  estimateGasPrice,
  waitForTransaction
};