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
   let tokenObj = {};
   const keys = Object.keys(data);
   for (let oneKey in keys) {
      tokenObj[keys[oneKey]] = data[keys[oneKey]];
   }
   const token = jwt.sign(tokenObj, keyFile, {algorithm: 'RS256', expiresIn: "4h"});
   console.log(token);
   return token;
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