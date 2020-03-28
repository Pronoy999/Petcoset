const bookingHandler = {};
const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const childProcess = require('child_process');
/**
 * Method to handle the booking requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response object and the response code.
 */
bookingHandler.booking = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const bookingId = validator.validateNumber(dataObject.postData[constants.BOOKING_ID]) ?
            dataObject.postData[constants.BOOKING_ID] : false;
         const bookingType = validator.validateString(dataObject.postData[constants.BOOKING_TYPE]) &&
         (dataObject.postData[constants.BOOKING_TYPE] === constants.BOOKING_TYPE_SUBSCRIPTION || dataObject.postData[constants.BOOKING_TYPE] === constants.BOOKING_TYPE_SERVICE) ?
            dataObject.postData[constants.BOOKING_TYPE] : false;
         const customerId = validator.validateNumber(dataObject.postData[constants.CUSTOMER_ID]) ?
            dataObject.postData[constants.CUSTOMER_ID] : false;
         const serviceID = validator.validateNumber(dataObject.postData[constants.BOOKING_SERVICE_ID]) ?
            dataObject.postData[constants.BOOKING_SERVICE_ID] : false;
         const subscriptionId = validator.validateNumber(dataObject.postData[constants.BOOKING_SUBSCRIPTION_ID]) ?
            dataObject.postData[constants.BOOKING_SUBSCRIPTION_ID] : false;
         const employeeId = validator.validateNumber(dataObject.postData[constants.BOOKING_EMPLOYEE_ID]) ?
            dataObject.postData[constants.BOOKING_EMPLOYEE_ID] : false;
         const vendorId = validator.validateNumber(dataObject.postData[constants.BOOKING_VENDOR_ID]) ?
            dataObject.postData[constants.BOOKING_VENDOR_ID] : false;
         const amount = validator.validateNumber(dataObject.postData[constants.BOOKING_TOTAL_AMOUNT]) ?
            dataObject.postData[constants.BOOKING_TOTAL_AMOUNT] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ? dataObject.postData[constants.JW_TOKEN] : false;
         if (bookingType && customerId && jwToken && (subscriptionId || serviceID)) {
            let serviceData = {};
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TYPE] = constants.CORE_BOOKING_CREATE;
            let childWorker = childProcess.fork(`${__dirname}/../CoreServices/booking.js`);
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
 * Exporting the booking handler.
 * @type {{}}
 */
module.exports = bookingHandler;