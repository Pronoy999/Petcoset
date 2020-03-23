const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const tokenGenerator = {};
/**
 * Method to generate the token.
 * @param data: The object to convert to token.
 * @returns {String}: jwToken.
 */
tokenGenerator.getToken = (data) => {
   const keyFile = fs.readFileSync(path.resolve(__dirname + "/../KeyFiles/first.pem"), "utf8");
   return jwt.sign(data, keyFile, {algorithm: 'RS256', expiresIn: "4h"});
};
/**
 * Method to verify the JWtoken.
 * @param token: The token to be verified.
 * @returns {*}
 */
tokenGenerator.validateToken = (token) => {
   const keyFile = fs.readFileSync(path.resolve(__dirname + "/../KeyFiles/second.crt"), "utf8");
   return jwt.verify(token, keyFile);
};
/**
 * Exporting the module.
 * @type {{}}
 */
module.exports = tokenGenerator;