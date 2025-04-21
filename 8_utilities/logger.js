/**
 * Enhanced logging system for ASECN
 * Provides standardized logging across all modules with severity levels
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LOG_PATH = path.join(__dirname, '..', '1_memory-core', 'memory-log.json');
const ERROR_LOG_PATH = path.join(__dirname, '..', 'logs', 'errors.log');
const CONSOLE_OUTPUT = true;

// Create logs directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'logs'), { recursive: true });
}

/**
 * Log levels and their severity
 */
const LOG_LEVELS = {
  DEBUG: { value: 0, label: 'DEBUG', color: '\x1b[36m' }, // Cyan
  INFO: { value: 1, label: 'INFO', color: '\x1b[32m' },   // Green
  WARN: { value: 2, label: 'WARN', color: '\x1b[33m' },   // Yellow
  ERROR: { value: 3, label: 'ERROR', color: '\x1b[31m' }, // Red
  FATAL: { value: 4, label: 'FATAL', color: '\x1b[35m' }  // Magenta
};

// Reset ANSI color code
const RESET_COLOR = '\x1b[0m';

/**
 * Logs an entry with specified level and details
 * 
 * @param {Object} entry - Log entry object
 * @param {string} entry.level - Log level (DEBUG, INFO, WARN, ERROR, FATAL)
 * @param {string} entry.source - Source module/component
 * @param {string} entry.message - Log message
 * @param {Object} [entry.details] - Additional details/context
 * @param {Error} [entry.error] - Error object if applicable
 */
function log(entry) {
  // Set defaults and normalize input
  const level = (entry.level || entry.type || 'INFO').toUpperCase();
  const source = entry.source || 'system';
  const message = entry.message || 'No message provided';
  const details = entry.details || {};
  const error = entry.error || null;
  
  // Get timestamp
  const timestamp = new Date().toISOString();
  
  // Create structured log object
  const logData = { 
    timestamp,
    level,
    source,
    message,
    details
  };
  
  // Add error information if present
  if (error) {
    logData.error = {
      name: error.name || 'Error',
      message: error.message,
      stack: error.stack
    };
    
    // Add to error log file for all errors
    if (level === 'ERROR' || level === 'FATAL') {
      try {
        const errorLogEntry = `[${timestamp}] ${level} - ${source}: ${message}\n`;
        const errorDetail = `Error: ${error.message}\nStack: ${error.stack}\n\n`;
        fs.appendFileSync(ERROR_LOG_PATH, errorLogEntry + errorDetail);
      } catch (writeError) {
        console.error('Failed to write to error log:', writeError);
      }
    }
  }
  
  // Console output if enabled
  if (CONSOLE_OUTPUT) {
    const logLevel = LOG_LEVELS[level] || LOG_LEVELS.INFO;
    const colorCode = logLevel.color || '';
    console.log(
      `${colorCode}[${timestamp}] [${logLevel.label}]${RESET_COLOR} ${source}: ${message}`,
      (Object.keys(details).length > 0 || error) ? '\n' + JSON.stringify(details, null, 2) : ''
    );
    
    // Log error trace to console if present
    if (error && error.stack) {
      console.error(`${LOG_LEVELS.ERROR.color}${error.stack}${RESET_COLOR}`);
    }
  }
  
  // Write to memory log file
  try {
    let logs = [];
    
    // Read existing logs if file exists
    if (fs.existsSync(LOG_PATH)) {
      const fileContent = fs.readFileSync(LOG_PATH, 'utf-8');
      try {
        logs = JSON.parse(fileContent);
        if (!Array.isArray(logs)) logs = [];
      } catch (parseError) {
        console.error('Failed to parse log file, creating new log array');
        logs = [];
      }
    }
    
    // Add new log entry
    logs.push(logData);
    
    // Write back to file
    fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));
  } catch (fileError) {
    console.error('Failed to write to log file:', fileError);
  }
  
  return logData;
}

/**
 * Helper methods for each log level
 */
const debug = (source, message, details) => log({ level: 'DEBUG', source, message, details });
const info = (source, message, details) => log({ level: 'INFO', source, message, details });
const warn = (source, message, details) => log({ level: 'WARN', source, message, details });
const error = (source, message, details, errorObj) => log({ level: 'ERROR', source, message, details, error: errorObj });
const fatal = (source, message, details, errorObj) => log({ level: 'FATAL', source, message, details, error: errorObj });

module.exports = {
  log,
  debug,
  info,
  warn,
  error,
  fatal,
  LOG_LEVELS
};
