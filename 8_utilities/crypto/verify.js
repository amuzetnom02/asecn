// Placeholder for verify.jsconst crypto = require('crypto');

function verify(data, signature, publicKey) {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(data);
    return verifier.verify(publicKey, signature, 'hex');
  }
  
  module.exports = verify;
  