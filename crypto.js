// Crypto
const crypto = require('crypto');
// Setup
const algo = process.env.ENCRYPTION_ALGORITHM || 'aes-256-ctr';

/**
 * Encrypt
 * @param {Object} sk secret key to encrypt payload
 * @param {Object} iv initialization vector
 * @param {String} payload the string to encrypt
 * @returns {String} encrypted value
 */
const encrypt = (sk, iv, payload) => {
  // Handle initialization vector
  const iV = typeof iv === 'string'
  ? Buffer.from(iv, 'hex')
  : iv;
  // init cipher
  const cipher = crypto.createCipheriv(algo, Buffer.from(sk), iV);
  // update text
  const updatedText = cipher.update(payload);
  // encrypt
  const encrypted = Buffer.concat([updatedText, cipher.final()]);

  return encrypted.toString('hex');
};
/**
 * 
 * @param {String} sk secret decryption key
 * @param {String} iv initialization vector
 * @param {String} payload to decrypt
 * @returns {String} decrypted string value
 */
const decrypt = (sk, iv, payload) => {
  // Handle initialization vector
  const iV = typeof iv === 'string'
  ? Buffer.from(iv, 'hex')
  : iv;
  // Handle encrypted text
  const encryptedText = Buffer.from(payload, 'hex');
  // Instantiate decipher
  const decipher = crypto.createDecipheriv(algo, Buffer.from(sk), iV);
  // Update decipher
  const updatedText = decipher.update(encryptedText);
  // Decrypt text
  const decryptedText = Buffer.concat([updatedText, decipher.final()]);
  
  return decryptedText.toString();
};
// Export
module.exports = {
  encrypt,
  decrypt,
};
