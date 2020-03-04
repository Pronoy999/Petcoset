const constants=require('./constants');
const crypto=require('crypto');
const encrypterDecrypter = {};
/**
 * Refer to https://gist.github.com/yoavniran/c78a0991e0152b306c25
 */
encrypterDecrypter.encrypt=(text)=>{
    const cipher=crypto.createCipheriv("aes-256-cbc","key",null);
    let crypted=cipher.update(text,"utf8","hex");
    crypted+=cipher.update("hex");
    console.log(crypted);
};
encrypterDecrypter.encrypt("HelLO");

/**
 * Exporting the module. 
 */
module.exports = encrypterDecrypter;