const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const childProcess = require('child_process');
const authHandler = {};
/**
 * Method to handle the authentication requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response code and the response message.
 */
authHandler.authenticate = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const email = validator.validateEmail(dataObject.postData[constants.AUTH_EMAIL]) ?
            dataObject.postData[constants.AUTH_EMAIL] : false;
         const password = validator.validateString(dataObject.postData[constants.AUTH_PASSWORD]) ?
            dataObject.postData[constants.AUTH_PASSWORD] : false;
         if (email && password) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TYPE] = constants.CORE_AUTH_CHECK;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/authentication.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else {
         reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
      }
   });
};

/**
 * Exporting the authentication handler.
 * @type {{}}
 */
module.exports = authHandler;