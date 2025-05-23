// Trigger system implementation
const fs = require('fs');
const path = require('path');
const { oracles } = require('../oracles');
const logger = require('../../8_utilities/logger');

// Read trigger configuration
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'trigger-config.json'), 'utf8')
);

// Log path for trigger events
const TRIGGER_LOG_PATH = path.join(__dirname, 'trigger-log.json');

// Initialize trigger log if it doesn't exist
if (!fs.existsSync(TRIGGER_LOG_PATH)) {
  fs.writeFileSync(TRIGGER_LOG_PATH, JSON.stringify([], null, 2));
}

// Read existing trigger log
const readTriggerLog = () => {
  try {
    return JSON.parse(fs.readFileSync(TRIGGER_LOG_PATH, 'utf8'));
  } catch (err) {
    logger.error(`Failed to read trigger log: ${err.message}`);
    return [];
  }
};

// Write to trigger log
const writeTriggerLog = (entry) => {
  try {
    const log = readTriggerLog();
    log.push({ ...entry, timestamp: new Date().toISOString() });
    fs.writeFileSync(TRIGGER_LOG_PATH, JSON.stringify(log, null, 2));
  } catch (err) {
    logger.error(`Failed to write to trigger log: ${err.message}`);
  }
};

// Trigger handlers for different trigger types
const triggerHandlers = {
  'eth-price-check': async () => {
    try {
      const price = await oracles['eth-usd-price'].getValue();
      // Price threshold trigger example
      if (price && price < 5000) {
        return {
          triggered: true,
          type: 'eth-price-check',
          data: { price, threshold: 5000 },
          message: `ETH price ${price} below threshold 5000`
        };
      }
      return { triggered: false };
    } catch (err) {
      logger.error(`ETH price check trigger error: ${err.message}`);
      return { triggered: false, error: err.message };
    }
  },
  
  'custom-signal': async () => {
    try {
      const signal = await oracles['custom-signal'].getValue();
      if (signal && signal.action) {
        return {
          triggered: true,
          type: 'custom-signal',
          data: signal,
          message: `Custom signal received: ${signal.action}`
        };
      }
      return { triggered: false };
    } catch (err) {
      logger.error(`Custom signal trigger error: ${err.message}`);
      return { triggered: false, error: err.message };
    }
  },
  
  'time-signal': async () => {
    try {
      const time = await oracles['time-feed'].getValue();
      // Check if it's the start of an hour (0 minutes)
      if (time && new Date(time).getMinutes() === 0) {
        return {
          triggered: true,
          type: 'time-signal',
          data: { time },
          message: `Hourly time signal triggered at ${time}`
        };
      }
      return { triggered: false };
    } catch (err) {
      logger.error(`Time signal trigger error: ${err.message}`);
      return { triggered: false, error: err.message };
    }
  }
};

// Check all active triggers
const checkTriggers = async () => {
  const results = [];
  
  for (const triggerName of config.activeTriggers) {
    if (triggerHandlers[triggerName]) {
      const result = await triggerHandlers[triggerName]();
      
      if (result.triggered) {
        writeTriggerLog(result);
        results.push(result);
      }
    } else {
      logger.warn(`No handler found for trigger: ${triggerName}`);
    }
  }
  
  return results;
};

// Start the trigger monitoring system
let triggerInterval;

const start = () => {
  if (triggerInterval) {
    clearInterval(triggerInterval);
  }
  
  triggerInterval = setInterval(async () => {
    try {
      const triggeredEvents = await checkTriggers();
      if (triggeredEvents.length > 0) {
        logger.info(`Triggers activated: ${triggeredEvents.length}`);
        // Here you would call the action layer or memory core to take actions
        // based on the triggered events
      }
    } catch (err) {
      logger.error(`Error in trigger system: ${err.message}`);
    }
  }, config.checkInterval);
  
  logger.info(`Trigger system started, checking every ${config.checkInterval}ms`);
};

const stop = () => {
  if (triggerInterval) {
    clearInterval(triggerInterval);
    triggerInterval = null;
    logger.info('Trigger system stopped');
  }
};

module.exports = {
  start,
  stop,
  checkTriggers,
  getConfig: () => config
};