/**
 * Cryptographic signing utilities for ASECN
 */
const crypto = require('crypto');

/**
 * Creates a digital signature using RSA-SHA256
 * 
 * @param {string|Buffer} data - Data to sign
 * @param {string} privateKey - Private key in PEM format
 * @returns {string} Signature in hex format
 * @throws {Error} If signing fails
 */
function sign(data, privateKey) {
  try {
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(typeof data === 'string' ? data : Buffer.from(data));
    return signer.sign(privateKey, 'hex');
  } catch (error) {
    throw new Error(`Signing error: ${error.message}`);
  }
}

/**
 * Creates a digital signature using ECDSA (Elliptic Curve Digital Signature Algorithm)
 * Commonly used in blockchain applications
 * 
 * @param {string|Buffer} data - Data to sign
 * @param {string} privateKey - Private key in PEM format
 * @returns {string} Signature in hex format
 * @throws {Error} If signing fails
 */
function signECDSA(data, privateKey) {
  try {
    const signer = crypto.createSign('SHA256');
    signer.update(typeof data === 'string' ? data : Buffer.from(data));
    return signer.sign({
      key: privateKey,
      dsaEncoding: 'der',
    }, 'hex');
  } catch (error) {
    throw new Error(`ECDSA signing error: ${error.message}`);
  }
}

module.exports = {
  sign,
  signECDSA
};
