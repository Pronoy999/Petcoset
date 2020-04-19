const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const responseGenerator = require('./../Services/responseGenerator');
const childProcess = require('child_process');
const serviceHandler = {};
/**
 * Method to handle the service Requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response code and the request code.
 */
serviceHandler.services = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const serviceName = validator.validateString(dataObject.postData[constants.SERVICE_NAME]) ?
            dataObject.postData[constants.SERVICE_NAME] : false;
         const employeeId = validator.validateNumber(dataObject.postData[constants.EMPLOYEE_ID]) ?
            dataObject.postData[constants.EMPLOYEE_ID] : false;
         const serviceType = validator.validateString(dataObject.postData[constants.SERVICE_TYPE]) ?
            dataObject.postData[constants.SERVICE_TYPE] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ? dataObject[constants.JW_TOKEN] : false;
         if (serviceName && employeeId && serviceType && jwToken) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TYPE] = constants.CORE_CREATE_SERVICE;
            serviceData[constants.CORE_TOKEN] = jwToken;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/service.js`);
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
      } else if (method === constants.HTTP_GET) {
         const serviceId = validator.validateNumber(dataObject.queryString[constants.SERVICE_ID]) ?
            dataObject.queryString[constants.SERVICE_ID] : false;
         const serviceName = validator.validateString(dataObject.queryString[constants.SERVICE_NAME]) ?
            dataObject.queryString[constants.SERVICE_NAME] : false;
         const jwToken = dataObject[constants.JW_TOKEN];
         if (jwToken) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TYPE] = constants.CORE_GET_SERVICE;
            serviceData[constants.CORE_DATA] = dataObject.queryString;
            serviceData[constants.CORE_TOKEN] = jwToken;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/service.js`);
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
 * Exporting the service Handler.
 * @type {{}}
 */
module.exports = serviceHandler;