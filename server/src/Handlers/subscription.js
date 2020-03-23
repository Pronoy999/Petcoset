const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const childProcess = require('child_process');
const subscriptionHandler = {};
/**
 * Method to handle the subscription request.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: the Response object and the response code.
 */
subscriptionHandler.subscription = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {

      } else if (method === constants.HTTP_GET) {
         //TODO:
      } else {
         reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
      }
   });
};
/**
 * Exporting the subscription handler.
 * @type {{}}
 */
module.exports = subscriptionHandler;