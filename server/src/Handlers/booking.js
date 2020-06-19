const bookingHandler = {};
const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const responseGenerator = require('./../Services/responseGenerator');
const printer = require('./../Helpers/printer');
const childProcess = require('child_process');
/**
 * Method to handle the booking for a service from a subscription.
 * This will only book services when a user has an active subscription.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response object and the response code.
 */
bookingHandler.booking = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_GET) {
         const customerId = validator.validateNumber(dataObject.queryString[constants.CUSTOMER_ID]) ?
            dataObject.queryString[constants.CUSTOMER_ID] : false;
         const bookingId = validator.validateNumber(dataObject.queryString[constants.BOOKING_ID]) ?
            dataObject.queryString[constants.BOOKING_ID] : false;
         const jwToken = validator.validateUndefined(dataObject[constants.JW_TOKEN]) ?
            dataObject[constants.JW_TOKEN] : false;
         if ((customerId || bookingId) && jwToken) {
            let serviceData = {};
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.queryString;
            serviceData[constants.CORE_TOKEN] = dataObject[constants.JW_TOKEN];
            serviceData[constants.CORE_TYPE] = constants.CORE_BOOKING_SEARCH;
            let childWorker = childProcess.fork(`${__dirname}/../CoreServices/booking.js`);
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
      } else if (method === constants.HTTP_POST) {
         const customerId = validator.validateNumber(dataObject.postData[constants.CUSTOMER_ID]) ?
            dataObject.postData[constants.CUSTOMER_ID] : false;
         const serviceID = validator.validateNumber(dataObject.postData[constants.BOOKING_SERVICE_ID]) ?
            dataObject.postData[constants.BOOKING_SERVICE_ID] : false;
         const subscriptionId = validator.validateNumber(dataObject.postData[constants.BOOKING_SUBSCRIPTION_ID]) ?
            dataObject.postData[constants.BOOKING_SUBSCRIPTION_ID] : false;
         const addressID = validator.validateNumber(dataObject.postData[constants.CUSTOMER_ADDRESS_ID]) ?
            dataObject.postData[constants.CUSTOMER_ADDRESS_ID] : false;
         const bookingTime = validator.validateString(dataObject.postData[constants.BOOKING_TIME]) ?
            dataObject.postData[constants.BOOKING_TIME] : false;
         const bookingEndTime = validator.validateString(dataObject.postData[constants.BOOKING_END_TIME]) ?
            dataObject.postData[constants.BOOKING_END_TIME] : false;
         const bookingDate = validator.validateDate(dataObject.postData[constants.BOOKING_DATE]) ?
            dataObject.postData[constants.BOOKING_DATE] : false;
         const recurringBooking = validator.validateUndefined(dataObject.postData[constants.RECURRING_BOOKINGS]) ?
            dataObject.postData[constants.RECURRING_BOOKINGS] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ? dataObject[constants.JW_TOKEN] : false;
         if (customerId && jwToken && subscriptionId && addressID && bookingDate && bookingTime && bookingEndTime && serviceID) {
            let serviceData = {};
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TYPE] = constants.CORE_BOOKING_CREATE_SUBS_SERVICE;
            let childWorker = childProcess.fork(`${__dirname}/../CoreServices/booking.js`);
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
         const bookingId = validator.validateNumber(dataObject.postData[constants.BOOKING_ID]) ?
            dataObject.postData[constants.BOOKING_ID] : false;
         //TODO: Cancel a booking.
      } else {
         reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
      }
   });
};
/**
 * Method to handle the booking requests for a subscription.
 * This allows users to book a subscription plan.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response object and the response code.
 */
bookingHandler.bookingSubscription = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const subscriptionID = validator.validateNumber(dataObject.postData[constants.BOOKING_SUBSCRIPTION_ID]) ?
            dataObject.postData[constants.BOOKING_SUBSCRIPTION_ID] : false;
         const amount = validator.validateNumber(dataObject.postData[constants.BOOKING_TOTAL_AMOUNT]) ?
            dataObject.postData[constants.BOOKING_TOTAL_AMOUNT] : false;
         const transactionID = validator.validateString(dataObject.postData[constants.PAYMENT_TRANSACTION_ID]) ?
            dataObject.postData[constants.PAYMENT_TRANSACTION_ID] : false;
         const customerId = validator.validateNumber(dataObject.postData[constants.BOOKING_CUSTOMER_ID]) ?
            dataObject.postData[constants.BOOKING_CUSTOMER_ID] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ? dataObject[constants.JW_TOKEN] : false;
         if (subscriptionID && amount && transactionID && customerId && jwToken) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TYPE] = constants.CORE_BOOKING_SUBSCRIPTION;
            let childWorker = childProcess.fork(`${__dirname}/../CoreServices/booking.js`);
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
 * Method to book a service for a customer without any subscription from a vendor.
 * It allows to book a service from a 3rd party vendor when the user do not have any
 * active subscription.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response object and the response code.
 */
bookingHandler.bookingService = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const serviceID = validator.validateNumber(dataObject.postData[constants.BOOKING_SERVICE_ID]) ?
            dataObject.postData[constants.BOOKING_SERVICE_ID] : false;
         const customerId = validator.validateNumber(dataObject.postData[constants.BOOKING_CUSTOMER_ID]) ?
            dataObject.postData[constants.BOOKING_CUSTOMER_ID] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ? dataObject[constants.JW_TOKEN] : false;
         const amount = validator.validateNumber(dataObject.postData[constants.BOOKING_TOTAL_AMOUNT]) ?
            dataObject.postData[constants.BOOKING_TOTAL_AMOUNT] : false;
         const transactionID = validator.validateString(dataObject.postData[constants.PAYMENT_TRANSACTION_ID]) ?
            dataObject.postData[constants.PAYMENT_TRANSACTION_ID] : false;
         const vendorID = validator.validateNumber(dataObject.postData[constants.BOOKING_VENDOR_ID]) ?
            dataObject.postData[constants.BOOKING_VENDOR_ID] : false;
         const addressId = validator.validateNumber(dataObject.postData[constants.CUSTOMER_ADDRESS_ID]) ?
            dataObject.postData[constants.CUSTOMER_ADDRESS_ID] : false;
         const bookingDate = validator.validateDate(dataObject.postData[constants.BOOKING_DATE]) ?
            dataObject.postData[constants.BOOKING_DATE] : false;
         const bookingTime = validator.validateString(dataObject.postData[constants.BOOKING_TIME]) ?
            dataObject.postData[constants.BOOKING_TIME] : false;
         const bookingEndTime = validator.validateString(dataObject.postData[constants.BOOKING_END_TIME]) ?
            dataObject.postData[constants.BOOKING_END_TIME] : false;
         const recurringBooking = validator.validateUndefined(dataObject.postData[constants.RECURRING_BOOKINGS]) ?
            dataObject.postData[constants.RECURRING_BOOKINGS] : false;
         if (serviceID && customerId && jwToken && amount && transactionID && vendorID && addressId && bookingTime && bookingEndTime && bookingDate) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TYPE] = constants.CORE_BOOKING_SERVICE;
            let childWorker = childProcess.fork(`${__dirname}/../CoreServices/booking.js`);
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
 * Exporting the booking handler.
 */
module.exports = bookingHandler;