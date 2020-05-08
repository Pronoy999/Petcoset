const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const childProcess = require('child_process');
const breedHandler = {};
/**
 * Method to handle requests to Breed.
 * @param dataObject: the request object.
 * @returns {Promise<unknown>}
 */
breedHandler.breed = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_GET) {
         const petType = validator.validateString(dataObject.queryString[constants.BREED_PET_TYPE]) ?
            dataObject.queryString[constants.BREED_PET_TYPE] : false;
         if (petType) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.queryString;
            serviceData[constants.CORE_TYPE] = constants.CORE_BREED_SEARCH;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/breed.js`);
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
 * Exporting the breed handler.
 * @type {{}}
 */
module.exports = breedHandler;