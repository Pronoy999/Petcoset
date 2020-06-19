const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const validator = require('./../Helpers/validators');
const tokenGenerator = require('./../Services/jwTokenGenerator');
const Booking = require('./../Entity/booking');
const bookingServices = {};
/**
 * Entry point to the core service. When a handler calls a core service process this method is called.
 * It validates the service authentication and then performs the request.
 */
process.on("message", (serviceData) => {
   const userName = serviceData[constants.CORE_SERVICE_USER_NAME];
   const password = serviceData[constants.CORE_SERVICE_PASSWORD];
   if (userName === process.env[constants.CORE_SERVICE_USER_NAME] && password === process.env[constants.CORE_SERVICE_PASSWORD]) {
      let promise;
      switch (serviceData[constants.CORE_TYPE]) {
         case constants.CORE_BOOKING_CREATE_SUBS_SERVICE:
            promise = bookingServices.createSubsServiceBooking(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_BOOKING_SUBSCRIPTION:
            promise = bookingServices.createSubscription(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_BOOKING_SERVICE:
            promise = bookingServices.createServiceBooking(serviceData[constants.CORE_DATA],
               serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_BOOKING_SEARCH:
            promise = bookingServices.getBookingDetails(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         default:
            process.send(responseGenerator.generateCoreResponse(false, false, constants.INVALID_PATH, constants.ERROR_LEVEL_1));
            process.exit(1);
      }
      promise.then((data) => {
         process.send(responseGenerator.generateCoreResponse(data[0], data[1]));
         process.exit(0);
      }).catch(err => {
         process.send(responseGenerator.generateCoreResponse(false, false, err[0], err[1]));
         process.exit(1);
      });
   } else {
      process.send(responseGenerator.generateCoreResponse(false, false,
         constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4));
      process.exit(1);
   }
});
/**
 * Method to handle the booking request for a service from an active subscription.
 * @param dataObject: The service data.
 * @param jwToken: The user token.
 * @returns {Promise<unknown>}
 */
bookingServices.createSubsServiceBooking = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (validator.validateUndefined(tokenGenerator.validateToken(jwToken))) {
         const booking = new Booking(false, constants.BOOKING_TYPE_SUBSCRIPTION_SERVICE, dataObject[constants.BOOKING_CUSTOMER_ID],
            dataObject[constants.BOOKING_SERVICE_ID]);
         booking.createSubscriptionServiceBooking(dataObject[constants.BOOKING_SUBSCRIPTION_ID], dataObject[constants.CUSTOMER_ADDRESS_ID],
            dataObject[constants.BOOKING_TIME], dataObject[constants.BOOKING_END_TIME], dataObject[constants.BOOKING_DATE],
            dataObject[constants.BOOKING_REMARKS],
            dataObject[constants.RECURRING_BOOKINGS])
            .then(bookingId => {
               resolve([bookingId, constants.RESPONSE_SUCESS_LEVEL_1]);
            }).catch(err => {
            reject([constants.ERROR_MESSAGE, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Method to book a subscription plan.
 * @param dataObject: The required data.
 * @param jwToken: The token of the user.
 * @returns {Promise<unknown>}
 */
bookingServices.createSubscription = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (validator.validateUndefined(tokenGenerator.validateToken(jwToken))) {
         const booking = new Booking(false, constants.BOOKING_TYPE_SUBSCRIPTION, dataObject[constants.BOOKING_CUSTOMER_ID]);
         booking.createSubscriptionBooking(dataObject[constants.BOOKING_SUBSCRIPTION_ID], dataObject[constants.BOOKING_TOTAL_AMOUNT],
            dataObject[constants.PAYMENT_TRANSACTION_ID])
            .then(bookingID => {
               resolve([bookingID, constants.RESPONSE_SUCESS_LEVEL_1]);
            }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         printer.printError("Invalid JwToken");
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Method to create a booking for a service from a vendor without any active subscription.
 * @param dataObject: The required data.
 * @param jwToken: The JwToken of the user.
 * @returns {Promise<unknown>}
 */
bookingServices.createServiceBooking = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (validator.validateUndefined(tokenGenerator.validateToken(jwToken))) {
         const booking = new Booking(false, constants.BOOKING_TYPE_SERVICE, dataObject[constants.BOOKING_CUSTOMER_ID],
            dataObject[constants.BOOKING_SERVICE_ID]);
         booking.createServiceBooking(dataObject[constants.BOOKING_VENDOR_ID],
            dataObject[constants.BOOKING_TOTAL_AMOUNT], dataObject[constants.PAYMENT_TRANSACTION_ID],
            dataObject[constants.BOOKING_DATE], dataObject[constants.BOOKING_TIME],
            dataObject[constants.BOOKING_END_TIME],
            dataObject[constants.CUSTOMER_ADDRESS_ID],
            dataObject[constants.BOOKING_REMARKS],
            dataObject[constants.RECURRING_BOOKINGS]).then(bookingId => {
            resolve([bookingId, constants.RESPONSE_SUCESS_LEVEL_1]);
         }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Method to search the booking details.
 * @param dataObject: The service data filter.
 * @param jwToken: the token of the user.
 * @returns {Promise<Array>}: The response object and the success or error level.
 */
bookingServices.getBookingDetails = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (tokenGenerator.validateToken(jwToken)) {
         const booking = new Booking(dataObject[constants.BOOKING_ID], false, dataObject[constants.BOOKING_CUSTOMER_ID]);
         booking.getBookingDetails().then(bookingDetails => {
            resolve([bookingDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
         }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
