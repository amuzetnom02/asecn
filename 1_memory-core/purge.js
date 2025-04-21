/**
 * Memory Core purge module
 * Safely clears memory state with backup capabilities
 */
const fs = require('fs');
const path = require('path');
const logger = require('../8_utilities/logger');

const memoryPath = path.join(__dirname, 'memory-state.json');
const backupsDir = path.join(__dirname, 'backups');

/**
 * Purges memory state, optionally creating backup first
 * 
 * @param {Object} [options] - Purge options
 * @param {boolean} [options.createBackup=true] - Whether to create backup before purging
 * @param {string} [options.backupLabel] - Optional label for the backup file
 * @param {boolean} [options.softPurge=false] - If true, keeps certain critical memories
 * @param {string[]} [options.preserveTags] - Tags of memories to preserve if softPurge is true
 * @returns {Object} Result of the purge operation
 */
function purgeMemory(options = {}) {
  const { 
    createBackup = true, 
    backupLabel = `pre-purge-${Date.now()}`,
    softPurge = false,
    preserveTags = ['system', 'critical']
  } = options;
  
  try {
    // Check if memory file exists
    if (!fs.existsSync(memoryPath)) {
      logger.warn('memory-core', 'Memory state file does not exist, initializing with empty array');
      fs.writeFileSync(memoryPath, '[]');
      return { 
        success: true, 
        message: 'Initialized with empty memory state',
        entriesAffected: 0
      };
    }
    
    // Create backups directory if it doesn't exist and backup is requested
    if (createBackup && !fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    // Read current memory state for backup or soft purge
    const memoryData = fs.readFileSync(memoryPath, 'utf-8');
    let memory = [];
    
    try {
      memory = JSON.parse(memoryData);
      if (!Array.isArray(memory)) {
        throw new Error('Memory state is not an array');
      }
    } catch (parseError) {
      logger.error('memory-core', 'Failed to parse memory state for purge', {}, parseError);
      
      if (createBackup) {
        // Backup corrupted file
        const corruptBackupPath = path.join(backupsDir, `corrupted-${Date.now()}.json`);
        fs.copyFileSync(memoryPath, corruptBackupPath);
        logger.info('memory-core', `Created backup of corrupted memory state at ${corruptBackupPath}`);
      }
      
      // Initialize with empty array
      fs.writeFileSync(memoryPath, '[]');
      logger.info('memory-core', 'Initialized with empty memory state after corruption');
      
      return {
        success: true,
        message: 'Memory was corrupted and has been reinitialized',
        entriesAffected: 0,
        wasCorrupted: true
      };
    }
    
    const entriesCount = memory.length;
    
    // Create backup if requested
    if (createBackup) {
      const backupPath = path.join(backupsDir, `${backupLabel}.json`);
      fs.writeFileSync(backupPath, memoryData);
      logger.info('memory-core', `Created memory backup at ${backupPath}`, { entriesCount });
    }
    
    // Handle soft purge (preserve certain memories)
    if (softPurge && preserveTags.length > 0) {
      const preservedMemories = memory.filter(entry => 
        entry.tags && Array.isArray(entry.tags) && 
        entry.tags.some(tag => preserveTags.includes(tag))
      );
      
      fs.writeFileSync(memoryPath, JSON.stringify(preservedMemories, null, 2));
      const preservedCount = preservedMemories.length;
      
      logger.info('memory-core', 'Soft purge completed', {
        originalCount: entriesCount,
        preservedCount,
        removedCount: entriesCount - preservedCount
      });
      
      return {
        success: true,
        message: 'Memory soft purge completed',
        entriesAffected: entriesCount - preservedCount,
        preservedCount
      };
    }
    
    // Full purge
    fs.writeFileSync(memoryPath, '[]');
    logger.info('memory-core', 'Memory fully purged', { entriesCount });
    
    return {
      success: true,
      message: 'Memory completely purged',
      entriesAffected: entriesCount
    };
    
  } catch (purgeError) {
    logger.error('memory-core', 'Memory purge failed', { options }, purgeError);
    
    return {
      success: false,
      message: `Memory purge failed: ${purgeError.message}`,
      error: purgeError.message
    };
  }
}

/**
 * Lists available memory backups
 * 
 * @returns {Array<Object>} List of available backups with metadata
 */
function listBackups() {
  try {
    if (!fs.existsSync(backupsDir)) {
      return [];
    }
    
    const backupFiles = fs.readdirSync(backupsDir).filter(file => file.endsWith('.json'));
    
    return backupFiles.map(file => {
      const filePath = path.join(backupsDir, file);
      const stats = fs.statSync(filePath);
      
      let entryCount = 0;
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        entryCount = Array.isArray(data) ? data.length : 0;
      } catch (e) {
        // If we can't parse the file, leave entry count as 0
      }
      
      return {
        filename: file,
        created: stats.birthtime,
        size: stats.size,
        entryCount
      };
    }).sort((a, b) => b.created - a.created); // Sort newest first
  } catch (error) {
    logger.error('memory-core', 'Failed to list backups', {}, error);
    return [];
  }
}

/**
 * Restores memory from a backup
 * 
 * @param {string} backupFilename - Name of the backup file
 * @param {Object} [options] - Restore options
 * @param {boolean} [options.createBackup=true] - Whether to backup current state before restore
 * @returns {Object} Result of the restore operation
 */
function restoreFromBackup(backupFilename, options = {}) {
  const { createBackup = true } = options;
  
  try {
    const backupPath = path.join(backupsDir, backupFilename);
    
    if (!fs.existsSync(backupPath)) {
      return {
        success: false,
        message: `Backup file ${backupFilename} not found`
      };
    }
    
    // Backup current memory if requested
    if (createBackup && fs.existsSync(memoryPath)) {
      const currentBackupPath = path.join(backupsDir, `pre-restore-${Date.now()}.json`);
      fs.copyFileSync(memoryPath, currentBackupPath);
      logger.info('memory-core', `Created backup of current memory state at ${currentBackupPath}`);
    }
    
    // Parse backup file to validate it
    let backupData;
    try {
      const fileContent = fs.readFileSync(backupPath, 'utf-8');
      backupData = JSON.parse(fileContent);
      
      if (!Array.isArray(backupData)) {
        throw new Error('Backup data is not an array');
      }
    } catch (parseError) {
      return {
        success: false,
        message: `Failed to parse backup file: ${parseError.message}`
      };
    }
    
    // Perform the restore
    fs.copyFileSync(backupPath, memoryPath);
    
    logger.info('memory-core', `Restored memory from backup ${backupFilename}`, {
      entriesCount: backupData.length
    });
    
    return {
      success: true,
      message: `Memory restored from backup ${backupFilename}`,
      entriesCount: backupData.length
    };
    
  } catch (restoreError) {
    logger.error('memory-core', 'Failed to restore from backup', { backupFilename }, restoreError);
    
    return {
      success: false,
      message: `Restore failed: ${restoreError.message}`,
      error: restoreError.message
    };
  }
}

module.exports = {
  purgeMemory,
  listBackups,
  restoreFromBackup
};
