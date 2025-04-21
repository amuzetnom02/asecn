/**
 * Memory Core read module
 * Reads memory state from storage with error handling
 */
const fs = require('fs');
const path = require('path');
const logger = require('../8_utilities/logger');

const memoryPath = path.join(__dirname, 'memory-state.json');

/**
 * Reads the entire memory state
 * 
 * @param {Object} [options] - Read options
 * @param {boolean} [options.safeRead=true] - Returns empty array on error instead of throwing
 * @returns {Array} Memory entries
 * @throws {Error} If file cannot be read and safeRead is false
 */
function readMemory(options = {}) {
  const { safeRead = true } = options;
  
  try {
    // Check if file exists
    if (!fs.existsSync(memoryPath)) {
      logger.warn('memory-core', 'Memory state file does not exist, initializing with empty array');
      fs.writeFileSync(memoryPath, '[]');
      return [];
    }
    
    const fileContent = fs.readFileSync(memoryPath, 'utf-8');
    
    try {
      const memory = JSON.parse(fileContent);
      
      // Validate that memory is an array
      if (!Array.isArray(memory)) {
        logger.error('memory-core', 'Memory state is not an array, initializing with empty array');
        fs.writeFileSync(memoryPath, '[]');
        return [];
      }
      
      return memory;
    } catch (parseError) {
      logger.error('memory-core', 'Failed to parse memory state file', {}, parseError);
      
      // Create backup of corrupted file
      const backupPath = `${memoryPath}.corrupted.${Date.now()}`;
      fs.copyFileSync(memoryPath, backupPath);
      logger.info('memory-core', `Created backup of corrupted memory state file at ${backupPath}`);
      
      // Return empty array or throw based on safeRead option
      if (safeRead) {
        fs.writeFileSync(memoryPath, '[]');
        return [];
      } else {
        throw new Error(`Failed to parse memory state file: ${parseError.message}`);
      }
    }
  } catch (readError) {
    logger.error('memory-core', 'Failed to read memory state file', {}, readError);
    
    // Return empty array or throw based on safeRead option
    if (safeRead) {
      return [];
    } else {
      throw readError;
    }
  }
}

module.exports = readMemory;
