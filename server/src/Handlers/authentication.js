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
               if (childReply[constants.CORE_ERROR_LEVEL]) {
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
 * Method to handle all the OTP request.
 * @param dataObject: The request object.
 * @returns {Promise<unknown>}
 */
authHandler.otp = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const mobileNumber = validator.validatePhone(dataObject.postData[constants.CUSTOMER_PHONE_NUMBER]) ?
            dataObject.postData[constants.CUSTOMER_PHONE_NUMBER] : false;
         if (mobileNumber) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TYPE] = constants.CORE_AUTH_OTP_REQEUST;
            serviceData[constants.CORE_DATA] = dataObject.postData;
            let childWorker = childProcess.fork(`${__dirname}/../CoreServices/authentication.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else if (method === constants.HTTP_PUT) {
         const mobileNumber = validator.validatePhone(dataObject.postData[constants.CUSTOMER_PHONE_NUMBER]) ?
            dataObject.postData[constants.CUSTOMER_PHONE_NUMBER] : false;
         const otp = validator.validateNumber(dataObject.postData[constants.OTP]) ? dataObject.postData[constants.OTP] : false;
         if (mobileNumber && otp) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TYPE] = constants.CORE_AUTH_OTP_VALIDATE;
            serviceData[constants.CORE_DATA] = dataObject.postData;
            let childWorker = childProcess.fork(`${__dirname}/../CoreServices/authentication.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
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
 * Method to handle requests for forget password.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}
 */
authHandler.forgetPassword = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const email = validator.validateEmail(dataObject.postData[constants.AUTH_EMAIL]) ?
            dataObject.postData[constants.AUTH_EMAIL] : false;
         const isProd = validator.validateNumber(dataObject.postData[constants.IS_PRODUCTION]) ?
            dataObject.postData[constants.IS_PRODUCTION] : 0;
         if (email) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TYPE] = constants.CORE_AUTH_REQUEST_PASSWORD_TOKEN;
            serviceData[constants.CORE_DATA] = dataObject.postData;
            let childWorker = childProcess.fork(`${__dirname}/../CoreServices/authentication.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else if (method === constants.HTTP_PUT) {
         const email = validator.validateEmail(dataObject.postData[constants.AUTH_EMAIL]) ?
            dataObject.postData[constants.AUTH_EMAIL] : false;
         const token = validator.validateString(dataObject.postData[constants.AUTH_PASSWORD_TOKEN]) ?
            dataObject.postData[constants.AUTH_PASSWORD_TOKEN] : false;
         const password = validator.validateString(dataObject.postData[constants.AUTH_PASSWORD]) ?
            dataObject.postData[constants.AUTH_PASSWORD] : false;
         if (email && password && token) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TYPE] = constants.CORE_AUTH_PASSWORD_FORGET;
            serviceData[constants.CORE_DATA] = dataObject.postData;
            let childWorker = childProcess.fork(`${__dirname}/../CoreServices/authentication.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
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
 */
module.exports = authHandler;