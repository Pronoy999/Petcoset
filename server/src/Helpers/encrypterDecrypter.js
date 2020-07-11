const constants = require('./constants');
const config = require("./config");
const crypto = require("crypto");
const encryptDecrypt = {};
/**
 * Method to encrypt the data.
 * @param dataToBeEncrypted: The Data to be encrypted.
 * @returns {string}: the String encrypted data.
 */
encryptDecrypt.encrypt = (dataToBeEncrypted) => {
   const iv = Buffer.alloc(16, process.env[constants.ENCRYPTION_KEY_KEY]);
   const cipher = crypto.createCipheriv(config.ENCRYPT_ALGO, process.env[constants.ENCRYPTION_KEY_KEY], iv);
   let encryptedData = cipher.update(dataToBeEncrypted, "utf8", config.ENCRYPT_ENCODING);
   encryptedData += cipher.final(config.ENCRYPT_ENCODING);
   return encryptedData.toString();
};
/**
 * Method to decrypt the data.
 * @param encryptedData: The encrypted data.
 * @returns {string}: The String decrypted data.
 */
encryptDecrypt.decrypt = (encryptedData) => {
   const iv = Buffer.alloc(16, process.env[constants.ENCRYPTION_KEY_KEY]);
   const cipher = crypto.createDecipheriv(config.ENCRYPT_ALGO, process.env[constants.ENCRYPTION_KEY_KEY], iv);
   let decryptedData = cipher.update(encryptedData, config.ENCRYPT_ENCODING);
   decryptedData += cipher.final();
   return decryptedData.toString();
};
/**
 * Exporting the module.
 */
module.exports = encryptDecrypt;