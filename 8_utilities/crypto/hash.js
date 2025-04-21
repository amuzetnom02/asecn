/**
 * Hash utility functions for ASECN
 */
const crypto = require('crypto');

/**
 * Creates a SHA-256 hash of input data
 * @param {string|Buffer} data - Data to hash
 * @returns {string} Hex encoded hash
 */
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Creates a SHA-512 hash of input data
 * @param {string|Buffer} data - Data to hash
 * @returns {string} Hex encoded hash
 */
function sha512(data) {
  return crypto.createHash('sha512').update(data).digest('hex');
}

/**
 * Creates a Keccak-256 hash (ethereum standard)
 * @param {string|Buffer} data - Data to hash
 * @returns {string} Hex encoded hash
 */
function keccak256(data) {
  return crypto.createHash('sha3-256').update(data).digest('hex');
}

module.exports = {
  sha256,
  sha512,
  keccak256
};
