const cityHandler = {};
const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const childProcess = require('child_process');
/**
 * Method to handle the city search.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}
 */
cityHandler.city = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_GET) {
         const cityName = validator.validateString(dataObject.queryString[constants.CITY_NAME]) ?
            dataObject.queryString[constants.CITY_NAME] : false;
         const stateID = validator.validateNumber(dataObject.queryString[constants.CITY_STATE_ID]) ?
            dataObject.queryString[constants.CITY_STATE_ID] : false;
         if (cityName || stateID) {
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/city.js`);
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TYPE] = constants.CORE_CITY_SEARCH;
            serviceData[constants.CORE_DATA] = dataObject.queryString;
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
 * Method to search for state.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}
 */
cityHandler.state = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_GET) {
         const childWorker = childProcess.fork(`${__dirname}/../CoreServices/city.js`);
         let serviceData = {};
         serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
         serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
         serviceData[constants.CORE_TYPE] = constants.CORE_STATE_SEARCH;
         serviceData[constants.CORE_DATA] = dataObject.queryString;
         childWorker.send(serviceData);
         childWorker.on("message", (childReply) => {
            if (childReply[constants.CORE_ERROR_LEVEL]) {
               resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
            } else {
               resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
            }
         });

      } else {
         reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
      }
   });
};
/**
 * Exporting the module.
 */
module.exports = cityHandler;