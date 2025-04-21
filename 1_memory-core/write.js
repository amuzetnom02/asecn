/**
 * Memory Core write module
 * Writes entries to memory state with error handling and validation
 */
const fs = require('fs');
const path = require('path');
const logger = require('../8_utilities/logger');
const schemaValidator = require('../8_utilities/schema-validator');
const readMemory = require('./read');

const memoryPath = path.join(__dirname, 'memory-state.json');

// Schema for memory entries
const memoryEntrySchema = {
  type: 'object',
  required: ['timestamp'],
  properties: {
    timestamp: { type: 'string', format: 'date-time' },
    source: { type: 'string' },
    data: { type: 'object' }
  }
};

/**
 * Writes an entry to memory
 * 
 * @param {Object} entry - Memory entry to write
 * @param {Object} [options] - Write options
 * @param {boolean} [options.validate=true] - Whether to validate entry against schema
 * @param {boolean} [options.allowOverwrite=false] - Whether to allow overwriting existing entries with same ID
 * @returns {Object} Written entry with timestamp
 * @throws {Error} If entry validation fails or write fails
 */
function writeMemory(entry, options = {}) {
  const { validate = true, allowOverwrite = false } = options;
  
  try {
    // Ensure timestamp is present
    const timestamp = entry.timestamp || new Date().toISOString();
    const memoryEntry = { timestamp, ...entry };
    
    // Validate entry if enabled
    if (validate) {
      const validation = schemaValidator.validate(memoryEntry, memoryEntrySchema);
      if (!validation.success) {
        const error = new Error(`Invalid memory entry: ${validation.errors.join(', ')}`);
        logger.error('memory-core', 'Memory entry validation failed', { entry }, error);
        throw error;
      }
    }
    
    // Read current memory state
    const memory = readMemory();
    
    // Check for duplicate ID if entry has an ID and allowOverwrite is false
    if (entry.id && !allowOverwrite) {
      const duplicateIndex = memory.findIndex(item => item.id === entry.id);
      if (duplicateIndex !== -1) {
        const error = new Error(`Memory entry with ID ${entry.id} already exists`);
        logger.error('memory-core', 'Duplicate memory entry ID', { existingEntry: memory[duplicateIndex] }, error);
        throw error;
      }
    }
    
    // Add new entry
    memory.push(memoryEntry);
    
    // Write updated memory state back to file
    fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
    logger.info('memory-core', 'Memory entry written', { id: entry.id || 'unnamed', timestamp });
    
    return memoryEntry;
  } catch (writeError) {
    // Only log error if it's not already a validation error we threw
    if (!writeError.message.includes('Invalid memory entry') && 
        !writeError.message.includes('Duplicate memory entry')) {
      logger.error('memory-core', 'Failed to write memory entry', { entry }, writeError);
    }
    throw writeError;
  }
}

module.exports = writeMemory;
