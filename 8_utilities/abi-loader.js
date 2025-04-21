// ABI loader utility for consistent contract interface loading
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

// Cache for loaded ABIs
const abiCache = {};

/**
 * Load an ABI file from the mock_abis directory
 * @param {string} abiName - Name of the ABI file without .json extension
 * @returns {Object} - Parsed ABI object
 */
function loadABI(abiName) {
  // Return from cache if already loaded
  if (abiCache[abiName]) {
    return abiCache[abiName];
  }

  // Path to ABI file
  const abiPath = path.join(__dirname, 'mock_abis', `${abiName}.json`);
  
  try {
    // Read and parse ABI file
    const abiData = fs.readFileSync(abiPath, 'utf8');
    const abi = JSON.parse(abiData);
    
    // Store in cache
    abiCache[abiName] = abi;
    
    return abi;
  } catch (error) {
    logger.log({
      type: 'error',
      source: 'abi-loader',
      message: `Failed to load ABI: ${abiName}`,
      details: error.message
    });
    
    throw new Error(`Failed to load ABI: ${abiName} - ${error.message}`);
  }
}

/**
 * Load multiple ABIs at once
 * @param {Array<string>} abiNames - Array of ABI names to load
 * @returns {Object} - Object with ABI name as key and parsed ABI as value
 */
function loadMultipleABIs(abiNames) {
  const abis = {};
  
  abiNames.forEach(name => {
    try {
      abis[name] = loadABI(name);
    } catch (error) {
      logger.log({
        type: 'error',
        source: 'abi-loader',
        message: `Failed to load one of multiple ABIs: ${name}`,
        details: error.message
      });
      // Continue loading other ABIs even if one fails
    }
  });
  
  return abis;
}

/**
 * Get list of available ABIs
 * @returns {Array<string>} - Array of available ABI names without .json extension
 */
function listAvailableABIs() {
  const abiDir = path.join(__dirname, 'mock_abis');
  
  try {
    return fs.readdirSync(abiDir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    logger.log({
      type: 'error',
      source: 'abi-loader',
      message: 'Failed to list available ABIs',
      details: error.message
    });
    return [];
  }
}

module.exports = {
  loadABI,
  loadMultipleABIs,
  listAvailableABIs
};