const constants = require('./constants');
const childProcess = require('child_process');
const validator = {};
/**
 * Method to check the validity of the email.
 * @param email: The Email to be checked.
 * @returns {boolean} true if valid, else false.
 */
validator.validateEmail = (email) => {
   let isValid;
   isValid = typeof (email) === 'string' && email.length > 0;
   if (!isValid) {
      return false;
   }
   return email.match(constants.EMAIL_REGEX) !== null;
};
/**
 * Method to validate phone number.
 * @param phoneNumber: the number to be checked.
 * @returns {boolean} true if valid, else false.
 */
validator.validatePhone = (phoneNumber) => {
   if (phoneNumber) {
      return phoneNumber.startsWith(constants.PHONE_NUMBER_PREFIX) && phoneNumber.length === 13;
   } else {
      return false;
   }
};
/**
 * Method to validate Number.
 * @param number: the number.
 * @returns {boolean} true if valid, else false.
 */
validator.validateNumber = (number) => {
   if (typeof (number) !== 'undefined' && number !== null && number) {
      return Number(number) > -1;
   }
   return false;
};
/**
 * Method to check the validity of the date.
 * Date Format: YYYY-MM-DD
 * @param date: the date to be checked.
 * @returns {boolean}: true if valid, else false.
 */
validator.validateDate = (date) => {
   try {
      return date.match(constants.DATE_REGEX) !== null;
   } catch (e) {
      return false;
   }
};
/**
 * Method to check whether data is undefined or not.
 * @param data: the data to be checked.
 * @returns {boolean} true if not undefined, else false.
 */
validator.validateUndefined = (data) => {
   return (typeof (data) !== 'undefined' && data !== null);
};
/**
 * Method to check whether the data is an Array or not.
 * @param data: the data to be checked.
 * @returns {boolean} true if array else false.
 */
validator.validateArray = (data) => {
   return Array.isArray(data) && data.length > 0;
};
/**
 * Method to check whether the data is boolean data type of not.
 * @param data: The data to be checked.
 * @returns {boolean}: true if its boolean, else false.
 */
validator.validateBoolean = (data) => {
   return typeof (data) === 'boolean';
};
/**
 * Method to check the validity.
 * @param token: The Token to be checked.
 * @returns {Promise<Boolean>}
 */
validator.validateToken = (token) => {
   return new Promise((resolve, reject) => {
      const worker = childProcess.fork(`${__dirname}/../CoreServices/api.js`);
      let serviceData = {};
      serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
      serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
      serviceData[constants.CORE_TYPE] = constants.CORE_API_TOKEN_CHECK;
      serviceData[constants.CORE_DATA] = {[constants.API_TOKEN_KEY]: token};
      worker.send(serviceData);
      worker.on("message", (serviceReply) => {
         if (serviceReply[constants.CORE_RESPONSE]) {
            resolve(true);
         } else {
            reject([constants.FORBIDDEN_REQUEST_CODE, constants.FORBIDDEN_MESSAGE]);
         }
      });
   });
};
/**
 * Method to validate normal string.
 * @param data: the data to be checked.
 * @returns {boolean} true: if valid, else false.
 */
validator.validateString = (data) => {
   return typeof (data) === 'string' && data.length > 0;
};
/**
 * Method to validate a character.
 * @param data: the data to be checked.
 * @returns {boolean} true: if it is a valid character, else false.
 */
validator.validateCharacter = (data) => {
   return typeof (data) === 'string' && data.length === 1;
};
/**
 * Method to validate an object as JSON.
 * @param data: the data to be validated.
 * @returns {boolean}: true if JSON, else false.
 */
validator.validateJSON = (data) => {
   try {
      JSON.parse(data);
   } catch (e) {
      return false;
   }
};
/**
 * exporting validator.
 */
module.exports = validator;