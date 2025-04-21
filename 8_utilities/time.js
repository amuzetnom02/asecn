/**
 * Time utility functions for standardized time handling across ASECN
 */

/**
 * Returns current time in ISO 8601 format
 * @returns {string} Current time in ISO format
 */
function nowISO() {
  return new Date().toISOString();
}

/**
 * Returns current timestamp in milliseconds
 * @returns {number} Current timestamp
 */
function timestamp() {
  return Date.now();
}

/**
 * Formats a date into ISO 8601 format
 * @param {Date|string|number} date - Date to format
 * @returns {string} Date in ISO format
 */
function formatISO(date) {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString();
}

/**
 * Calculates time difference in seconds
 * @param {Date|string|number} start - Start date
 * @param {Date|string|number} end - End date
 * @returns {number} Difference in seconds
 */
function diffSeconds(start, end) {
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end || Date.now());
  return Math.floor((endDate - startDate) / 1000);
}

module.exports = { 
  nowISO,
  timestamp,
  formatISO,
  diffSeconds
};
