// Mints a one-time genesis NFT to mark ASECN's birth.
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const logger = require('../8_utilities/logger');
const envConfig = require('../8_utilities/env-config');
const abiLoader = require('../8_utilities/abi-loader');

/**
 * Mints the Genesis NFT which marks the birth of the ASECN entity
 * This NFT is a unique identifier and proof of the system's origin
 * 
 * @returns {Promise<Object>} Transaction details if successful, or error information
 */
module.exports = async function mintGenesisNFT() {
  logger.info("Initializing Genesis NFT minting process...");
  
  try {
    // Load environment configuration
    const config = envConfig.getConfig();
    
    // Check if we have critical configuration errors
    if (envConfig.hasErrors()) {
      throw new Error(`Cannot mint Genesis NFT due to configuration errors: ${envConfig.getErrors().join(', ')}`);
    }
    
    // Get birth sequence data
    const birthData = JSON.parse(fs.readFileSync(
      path.join(__dirname, 'birth-sequence.json'),
      'utf8'
    ));
    
    // Load ERC721 ABI
    const erc721ABI = abiLoader.getABI('erc721');
    if (!erc721ABI) {
      throw new Error('Failed to load ERC721 ABI');
    }
    
    // Check if NFT contract address is set
    if (config.contracts.nftAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('NFT contract address not configured in environment variables');
    }
    
    // Configure provider
    let provider;
    if (config.blockchain.infuraApiKey) {
      provider = new ethers.providers.InfuraProvider(
        config.blockchain.network,
        config.blockchain.infuraApiKey
      );
      logger.info(`Using Infura provider for network: ${config.blockchain.network}`);
    } else if (config.blockchain.alchemyApiKey) {
      provider = new ethers.providers.AlchemyProvider(
        config.blockchain.network,
        config.blockchain.alchemyApiKey
      );
      logger.info(`Using Alchemy provider for network: ${config.blockchain.network}`);
    } else {
      provider = new ethers.providers.JsonRpcProvider(
        `https://${config.blockchain.network}.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161` // Public fallback key (limited usage)
      );
      logger.warn('Using public fallback provider - not recommended for production');
    }
    
    // Check if we have a private key for signing
    if (!config.wallet.privateKey) {
      throw new Error('Wallet private key not configured in environment variables');
    }
    
    // Create wallet and get signer
    const wallet = new ethers.Wallet(config.wallet.privateKey, provider);
    logger.info(`Using wallet address: ${wallet.address}`);
    
    // Create contract instance
    const nftContract = new ethers.Contract(
      config.contracts.nftAddress,
      erc721ABI,
      wallet
    );
    
    // Generate metadata for the Genesis NFT
    const genesisTokenURI = createGenesisMetadata(birthData);
    
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
    
    logger.info(`Current gas price (${config.gas.priceStrategy}): ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
    
    // Record mint attempt in proof log
    recordProofLog({
      action: 'MINT_GENESIS_NFT_ATTEMPT',
      timestamp: new Date().toISOString(),
      network: config.blockchain.network,
      walletAddress: wallet.address,
      contractAddress: config.contracts.nftAddress
    });
    
    // Mint the token - token ID 1 is reserved for Genesis
    logger.info('Sending Genesis NFT mint transaction...');
    const tx = await nftContract.mintGenesis(
      wallet.address,
      1, // Token ID 1 for Genesis
      genesisTokenURI,
      {
        gasPrice,
        gasLimit: config.gas.maxGasLimit
      }
    );
    
    logger.info(`Genesis NFT mint transaction sent: ${tx.hash}`);
    
    // Wait for confirmation
    logger.info(`Waiting for ${config.transactions.confirmationBlocks} confirmation blocks...`);
    const receipt = await tx.wait(config.transactions.confirmationBlocks);
    
    // Log successful transaction
    logger.info(`Genesis NFT minted successfully in block ${receipt.blockNumber}`);
    
    // Record successful mint in proof log
    recordProofLog({
      action: 'MINT_GENESIS_NFT_SUCCESS',
      timestamp: new Date().toISOString(),
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      tokenId: 1
    });
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      tokenId: 1,
      tokenURI: genesisTokenURI
    };
    
  } catch (err) {
    logger.error(`Failed to mint Genesis NFT: ${err.message}`);
    
    // Record failure in proof log
    recordProofLog({
      action: 'MINT_GENESIS_NFT_FAILURE',
      timestamp: new Date().toISOString(),
      error: err.message
    });
    
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Create Genesis NFT metadata
 * @param {Object} birthData - Birth sequence data
 * @returns {string} Token URI or IPFS hash
 */
function createGenesisMetadata(birthData) {
  // In a production system, we would upload this to IPFS
  // For now, we'll use a data URI
  
  const metadata = {
    name: "ASECN Genesis",
    description: "Genesis NFT marking the birth of the Autonomous Self-Evolving Cognitive Network",
    image: "https://ipfs.io/ipfs/QmYPrTDjupzVAJg5zg2PEGQ5E3qS8wjqmBuMPRpp9tkWEG", // Placeholder
    attributes: [
      {
        trait_type: "Creation Date",
        value: birthData.creationDate || new Date().toISOString()
      },
      {
        trait_type: "Entity Type",
        value: "Autonomous System"
      },
      {
        trait_type: "Version",
        value: birthData.version || "1.0.0"
      },
      {
        trait_type: "Creator",
        value: birthData.creator || "ASECN Project"
      }
    ],
    asecnData: {
      birthSignature: birthData.signature,
      birthTimestamp: birthData.timestamp,
      genesisHash: birthData.genesisHash
    }
  };
  
  // Convert to data URI
  const metadataStr = JSON.stringify(metadata);
  const dataURI = `data:application/json;base64,${Buffer.from(metadataStr).toString('base64')}`;
  
  return dataURI;
}

/**
 * Records entries in the proof log
 * @param {Object} data - Data to record
 */
function recordProofLog(data) {
  try {
    const logPath = path.join(__dirname, 'proof-log.json');
    let logEntries = [];
    
    // Read existing log if it exists
    if (fs.existsSync(logPath)) {
      logEntries = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }
    
    // Add new entry
    logEntries.push(data);
    
    // Write back to file
    fs.writeFileSync(logPath, JSON.stringify(logEntries, null, 2));
  } catch (err) {
    logger.error(`Failed to record in proof log: ${err.message}`);
  }
}
