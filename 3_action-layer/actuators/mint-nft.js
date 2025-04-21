/**
 * mint-nft.js - Handles NFT minting operations for ASECN
 * 
 * This actuator is responsible for minting NFTs to represent system-defined assets,
 * achievements, or milestones. It handles both ERC-721 standard NFTs with metadata.
 */

const { ethers } = require('ethers');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getContract, estimateGasPrice, waitForTransaction } = require('../../8_utilities/blockchain');
const { loadABI } = require('../../8_utilities/abi-loader');
const logger = require('../../8_utilities/logger');

// Track NFT minting history
const historyPath = path.join(__dirname, '..', 'nft-mint-history.json');
let mintHistory = [];

// Initialize history if exists
try {
  if (fs.existsSync(historyPath)) {
    mintHistory = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  } else {
    fs.writeFileSync(historyPath, JSON.stringify(mintHistory, null, 2));
  }
} catch (error) {
  logger.log({
    type: 'error',
    source: 'mint-nft',
    message: 'Failed to initialize mint history',
    details: error.message
  });
}

/**
 * Mint a new NFT using the configured NFT contract
 * 
 * @param {Object} params - NFT minting parameters
 * @param {string} params.recipient - Address to receive the NFT
 * @param {string} params.tokenURI - IPFS/HTTP URI to the token's metadata
 * @param {string} params.description - Description of what this NFT represents
 * @param {Object} options - Optional configuration
 * @param {string} options.contractAddress - Override default NFT contract address
 * @param {string} options.gasStrategy - Gas price strategy ('slow', 'medium', 'fast')
 * @returns {Promise<Object>} - Transaction result with tokenId
 */
async function mintNFT(params, options = {}) {
  try {
    const { recipient, tokenURI, description } = params;
    
    // Default to environment NFT contract address if not specified
    const contractAddress = options.contractAddress || process.env.NFT_CONTRACT_ADDRESS;
    
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('NFT contract address not configured');
    }
    
    // Validate required parameters
    if (!recipient || !ethers.utils.isAddress(recipient)) {
      throw new Error('Invalid recipient address');
    }
    
    if (!tokenURI) {
      throw new Error('Token URI is required');
    }
    
    logger.log({
      type: 'info',
      source: 'mint-nft',
      message: `Starting NFT mint process for ${recipient}`,
      details: { tokenURI, description }
    });

    // Get contract with ABI
    const nftContract = getContract(contractAddress, 'erc721');
    
    // Generate a deterministic token ID based on current time + recipient + metadata hash
    const metadataHash = ethers.utils.id(tokenURI);
    const timestampHex = Date.now().toString(16).padStart(12, '0');
    const recipientStripped = recipient.substring(2); // Remove 0x prefix
    const combinedHex = `0x${timestampHex}${recipientStripped.slice(0, 8)}`;
    const tokenId = ethers.BigNumber.from(combinedHex);
    
    // Estimate gas price based on strategy
    const gasPrice = await estimateGasPrice(options.gasStrategy || 'medium');
    
    // Prepare transaction
    const tx = await nftContract.safeMint(
      recipient,
      tokenId,
      tokenURI,
      { gasPrice }
    );
    
    logger.log({
      type: 'info',
      source: 'mint-nft',
      message: `NFT mint transaction submitted`,
      details: { txHash: tx.hash, tokenId: tokenId.toString() }
    });
    
    // Wait for transaction confirmation
    const receipt = await waitForTransaction(
      tx.hash, 
      parseInt(process.env.CONFIRMATION_BLOCKS) || 1
    );
    
    // Add to mint history
    const historyEntry = {
      timestamp: new Date().toISOString(),
      tokenId: tokenId.toString(),
      recipient,
      tokenURI,
      description,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    };
    
    mintHistory.push(historyEntry);
    fs.writeFileSync(historyPath, JSON.stringify(mintHistory, null, 2));
    
    logger.log({
      type: 'success',
      source: 'mint-nft',
      message: `NFT successfully minted`,
      details: historyEntry
    });
    
    return {
      success: true,
      tokenId: tokenId.toString(),
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    };
    
  } catch (error) {
    logger.log({
      type: 'error',
      source: 'mint-nft',
      message: 'NFT minting failed',
      details: error.message
    });
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get list of previously minted NFTs
 * @returns {Array<Object>} - List of minted NFTs
 */
function getMintHistory() {
  return mintHistory;
}

module.exports = {
  mintNFT,
  getMintHistory
};
