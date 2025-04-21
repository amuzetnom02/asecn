/**
 * Cryptographic verification utilities for ASECN
 */
const crypto = require('crypto');

/**
 * Verifies a digital signature using RSA-SHA256
 * 
 * @param {string|Buffer} data - Original data that was signed
 * @param {string} signature - Signature to verify (in hex format)
 * @param {string} publicKey - Public key in PEM format
 * @returns {boolean} True if signature is valid, false otherwise
 * @throws {Error} If verification process fails
 */
function verify(data, signature, publicKey) {
  try {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(typeof data === 'string' ? data : Buffer.from(data));
    return verifier.verify(publicKey, signature, 'hex');
  } catch (error) {
    throw new Error(`Verification error: ${error.message}`);
  }
}

/**
 * Verifies an ECDSA signature (commonly used in blockchain)
 * 
 * @param {string|Buffer} data - Original data that was signed
 * @param {string} signature - Signature to verify (in hex format)
 * @param {string} publicKey - Public key in PEM format
 * @returns {boolean} True if signature is valid, false otherwise
 * @throws {Error} If verification process fails
 */
function verifyECDSA(data, signature, publicKey) {
  try {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(typeof data === 'string' ? data : Buffer.from(data));
    return verifier.verify({
      key: publicKey,
      dsaEncoding: 'der'
    }, signature, 'hex');
  } catch (error) {
    throw new Error(`ECDSA verification error: ${error.message}`);
  }
}

module.exports = {
  verify,
  verifyECDSA
};
