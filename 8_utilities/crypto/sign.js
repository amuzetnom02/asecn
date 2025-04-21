// Placeholder for sign.jsconst crypto = require('crypto');

function sign(data, privateKey) {
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(data);
    return signer.sign(privateKey, 'hex');
  }
  
  module.exports = sign;
  