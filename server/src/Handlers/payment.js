const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const responseGenerator = require('./../Services/responseGenerator');
const printer = require('./../Helpers/printer');
const childProcess = require('child_process');
const paymentHandler = {};
/**
 * Method to handle all the requests for the payment endpoint.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}:
 */
paymentHandler.payment = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_GET) {
         //TODO:
      } else if (method === constants.HTTP_POST) {
         const bookingId = validator.validateNumber(dataObject.postData[constants.BOOKING_ID]) ?
            dataObject.postData[constants.BOOKING_ID] : false;
         const transactionId = validator.validateString(dataObject.postData[constants.PAYMENT_TRANSACTION_ID]) ?
            dataObject.postData[constants.PAYMENT_TRANSACTION_ID] : false;
         const customerId = validator.validateNumber(dataObject.postData[constants.CUSTOMER_ID]) ?
            dataObject.postData[constants.CUSTOMER_ID] : false;
         const paymentAmount = validator.validateNumber(dataObject.postData[constants.PAYMENT_AMOUNT]) ?
            dataObject.postData[constants.PAYMENT_AMOUNT] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ?
            dataObject[constants.JW_TOKEN] : false;
         if (bookingId && transactionId && customerId && paymentAmount && jwToken) {
            let serviceData = {};
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TYPE] = constants.CORE_PAYMENT_CREATE;
            let childWorker = childProcess.fork(`${__dirname}/../CoreServices/payment.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         }
      } else {
         reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
      }
   });
};
/**
 *Exporting the module.
 */
module.exports = paymentHandler;