/**
 * Action Layer - Central performer interface for executing blockchain actions
 * 
 * This module serves as the main interface for all action actuators, allowing
 * other parts of the ASECN system to perform blockchain operations through
 * a standardized API.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const logger = require('../8_utilities/logger');

// Import actuators
const mintNFT = require('./actuators/mint-nft');
const sendFunds = require('./actuators/send-funds');
const deployContract = require('./actuators/deploy-contract');

// Load allowed actions configuration
const allowedActionsPath = path.join(__dirname, 'allowed-actions.json');
const allowedActions = JSON.parse(fs.readFileSync(allowedActionsPath, 'utf8')).actions;

// Action log for tracking all performed actions
const actionLogPath = path.join(__dirname, 'action-log.json');
let actionLog = [];

// Initialize action log if it exists
try {
  if (fs.existsSync(actionLogPath)) {
    actionLog = JSON.parse(fs.readFileSync(actionLogPath, 'utf8'));
  } else {
    fs.writeFileSync(actionLogPath, JSON.stringify(actionLog, null, 2));
  }
} catch (error) {
  logger.log({
    type: 'error',
    source: 'action-layer',
    message: 'Failed to initialize action log',
    details: error.message
  });
}

/**
 * Log an action to the action log
 * 
 * @param {string} actionType - Type of action performed
 * @param {Object} params - Parameters used for the action
 * @param {Object} result - Result of the action
 * @param {string} source - Module/component that initiated the action
 */
function logAction(actionType, params, result, source = 'system') {
  const actionEntry = {
    timestamp: new Date().toISOString(),
    actionType,
    params: { ...params }, // Clone to avoid reference issues
    result: { ...result },
    source
  };
  
  actionLog.push(actionEntry);
  fs.writeFileSync(actionLogPath, JSON.stringify(actionLog, null, 2));
  
  logger.log({
    type: result.success ? 'success' : 'error',
    source: 'action-layer',
    message: `Action ${actionType} ${result.success ? 'succeeded' : 'failed'}`,
    details: actionEntry
  });
  
  return actionEntry;
}

/**
 * Check if an action type is allowed
 * 
 * @param {string} actionType - Type of action to check
 * @returns {boolean} - Whether the action is allowed
 */
function isActionAllowed(actionType) {
  return allowedActions.includes(actionType);
}

/**
 * Perform an action with the specified actuator
 * 
 * @param {string} actionType - Type of action to perform
 * @param {Object} params - Parameters for the action
 * @param {Object} options - Additional options
 * @param {string} source - Source of the action request
 * @returns {Promise<Object>} - Result of the action
 */
async function performAction(actionType, params, options = {}, source = 'system') {
  try {
    // Check if action is allowed
    if (!isActionAllowed(actionType)) {
      const error = {
        success: false,
        error: `Action type '${actionType}' is not allowed`
      };
      
      logAction(actionType, params, error, source);
      return error;
    }
    
    // Perform action based on type
    let result;
    
    switch (actionType) {
      case 'mint-nft':
        result = await mintNFT.mintNFT(params, options);
        break;
        
      case 'send-funds':
        if (params.tokenAddress) {
          // Send ERC20 tokens
          result = await sendFunds.sendERC20(params, options);
        } else {
          // Send ETH
          result = await sendFunds.sendEth(params, options);
        }
        break;
        
      case 'deploy-contract':
        if (params.artifactPath) {
          // Deploy from artifact
          result = await deployContract.deployFromArtifact(params, options);
        } else if (params.contractType) {
          // Deploy standard contract
          result = await deployContract.deployStandardContract(params, options);
        } else {
          // Deploy from bytecode and ABI
          result = await deployContract.deployContract(params, options);
        }
        break;
        
      default:
        result = {
          success: false,
          error: `Unknown action type: ${actionType}`
        };
    }
    
    // Log the action and result
    logAction(actionType, params, result, source);
    
    return result;
    
  } catch (error) {
    const errorResult = {
      success: false,
      error: error.message
    };
    
    logAction(actionType, params, errorResult, source);
    
    return errorResult;
  }
}

/**
 * Get the action history
 * 
 * @param {Object} filters - Optional filters for action type, source, etc.
 * @returns {Array<Object>} - Filtered action history
 */
function getActionHistory(filters = {}) {
  let filteredLog = [...actionLog];
  
  // Apply filters if provided
  if (filters.actionType) {
    filteredLog = filteredLog.filter(entry => entry.actionType === filters.actionType);
  }
  
  if (filters.source) {
    filteredLog = filteredLog.filter(entry => entry.source === filters.source);
  }
  
  if (filters.success !== undefined) {
    filteredLog = filteredLog.filter(entry => entry.result.success === filters.success);
  }
  
  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    filteredLog = filteredLog.filter(entry => new Date(entry.timestamp) >= startDate);
  }
  
  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    filteredLog = filteredLog.filter(entry => new Date(entry.timestamp) <= endDate);
  }
  
  // Sort by timestamp (newest first)
  filteredLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Apply limit if provided
  if (filters.limit && typeof filters.limit === 'number') {
    filteredLog = filteredLog.slice(0, filters.limit);
  }
  
  return filteredLog;
}

/**
 * Get list of allowed actions
 * 
 * @returns {Array<string>} - List of allowed action types
 */
function getAllowedActions() {
  return [...allowedActions]; // Return a copy to prevent modification
}

module.exports = {
  performAction,
  getActionHistory,
  getAllowedActions,
  isActionAllowed
};
