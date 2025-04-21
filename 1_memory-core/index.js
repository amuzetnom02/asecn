/**
 * Memory Core - Main module index
 * Provides centralized access to memory management functions
 */
const write = require('./write');
const read = require('./read');
const purgeModule = require('./purge');
const recall = require('./recall');

/**
 * Memory Core API
 */
module.exports = {
  // Core operations
  writeMemory: write,
  readMemory: read,
  recallMemory: recall,
  
  // Memory purging and backup management
  purgeMemory: purgeModule.purgeMemory,
  listBackups: purgeModule.listBackups,
  restoreFromBackup: purgeModule.restoreFromBackup
};
