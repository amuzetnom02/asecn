// Environment configuration manager
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('./logger');

/**
 * Environment configuration manager for ASECN
 * Provides secure environment variable management with validation and defaults
 */
class EnvironmentConfig {
  constructor() {
    this.config = {};
    this.loaded = false;
    this.errors = [];
  }

  /**
   * Load environment variables from config.env file
   * @returns {Object} The loaded configuration
   */
  load() {
    try {
      // Try to load from config.env in the project root
      const configPath = path.join(process.cwd(), 'config.env');
      
      if (fs.existsSync(configPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(configPath));
        
        // Set all variables from the env file to process.env
        for (const key in envConfig) {
          process.env[key] = envConfig[key] || process.env[key];
        }
        
        logger.info('Environment configuration loaded from config.env');
      } else {
        logger.warn('config.env file not found, using process.env only');
      }
      
      // Set up configuration with validation and defaults
      this._setupConfig();
      
      this.loaded = true;
      
      // Log configuration status (but don't log sensitive data)
      this._logConfigStatus();
      
      return this.config;
    } catch (err) {
      logger.error(`Failed to load environment configuration: ${err.message}`);
      throw err;
    }
  }

  /**
   * Set up configuration with validation and defaults
   * @private
   */
  _setupConfig() {
    // Blockchain Network Configuration
    this.config.blockchain = {
      network: this._validateEnv('BLOCKCHAIN_NETWORK', 'goerli'),
      infuraApiKey: this._validateEnv('INFURA_API_KEY', null, true),
      alchemyApiKey: this._validateEnv('ALCHEMY_API_KEY', null, true),
    };

    // Wallet Configuration
    this.config.wallet = {
      privateKey: this._validateEnv('WALLET_PRIVATE_KEY', null, true),
      address: this._validateEnv('WALLET_ADDRESS', null, true),
    };

    // Smart Contract Addresses
    this.config.contracts = {
      nftAddress: this._validateEnv('NFT_CONTRACT_ADDRESS', '0x0000000000000000000000000000000000000000'),
      treasuryAddress: this._validateEnv('TREASURY_CONTRACT_ADDRESS', '0x0000000000000000000000000000000000000000'),
    };

    // Gas Configuration
    this.config.gas = {
      priceStrategy: this._validateEnv('GAS_PRICE_STRATEGY', 'medium'),
      maxGasLimit: parseInt(this._validateEnv('MAX_GAS_LIMIT', '3000000')),
    };

    // Transaction options
    this.config.transactions = {
      confirmationBlocks: parseInt(this._validateEnv('CONFIRMATION_BLOCKS', '2')),
      transactionTimeout: parseInt(this._validateEnv('TRANSACTION_TIMEOUT', '120000')),
    };

    // Check for critical errors
    if (this.errors.length > 0) {
      logger.error(`Environment configuration has ${this.errors.length} critical errors`);
      this.errors.forEach(error => logger.error(`  - ${error}`));
    }
  }

  /**
   * Validate and retrieve an environment variable
   * @param {string} key - Environment variable key
   * @param {string} defaultValue - Default value if not found
   * @param {boolean} isCritical - Whether this config is critical (error if missing)
   * @returns {string} The value or default
   * @private
   */
  _validateEnv(key, defaultValue, isCritical = false) {
    const value = process.env[key];
    
    // For variables marked as "your-xxx-here", treat as if not set
    if (!value || value.includes('your-') || value === '') {
      if (isCritical && !defaultValue) {
        this.errors.push(`Missing critical environment variable: ${key}`);
      }
      return defaultValue;
    }
    
    return value;
  }

  /**
   * Log configuration status without exposing sensitive data
   * @private
   */
  _logConfigStatus() {
    logger.info('Environment configuration status:');
    
    // Network info
    logger.info(`  - Blockchain Network: ${this.config.blockchain.network}`);
    logger.info(`  - Infura API Key: ${this.config.blockchain.infuraApiKey ? 'Set' : 'Not Set'}`);
    logger.info(`  - Alchemy API Key: ${this.config.blockchain.alchemyApiKey ? 'Set' : 'Not Set'}`);
    
    // Wallet info (don't log private key!)
    logger.info(`  - Wallet Address: ${this.config.wallet.address || 'Not Set'}`);
    logger.info(`  - Wallet Private Key: ${this.config.wallet.privateKey ? 'Set (secured)' : 'Not Set'}`);
    
    // Contract info
    const nftAddressStatus = this.config.contracts.nftAddress === '0x0000000000000000000000000000000000000000' ? 
      'Not Set (using zero address)' : 'Set';
    const treasuryAddressStatus = this.config.contracts.treasuryAddress === '0x0000000000000000000000000000000000000000' ? 
      'Not Set (using zero address)' : 'Set';
    
    logger.info(`  - NFT Contract Address: ${nftAddressStatus}`);
    logger.info(`  - Treasury Contract Address: ${treasuryAddressStatus}`);
  }

  /**
   * Get the loaded configuration
   * @returns {Object} The configuration object
   */
  getConfig() {
    if (!this.loaded) {
      this.load();
    }
    return this.config;
  }

  /**
   * Check if configuration has critical errors
   * @returns {boolean} True if there are critical errors
   */
  hasErrors() {
    return this.errors.length > 0;
  }

  /**
   * Get configuration errors
   * @returns {Array} List of error messages
   */
  getErrors() {
    return this.errors;
  }
}

// Create a singleton instance
const envConfig = new EnvironmentConfig();

module.exports = envConfig;
