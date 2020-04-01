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
         case constants.CORE_BOOKING_CREATE:
            promise = bookingServices.createBooking(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
      }
   } else {
      process.send(responseGenerator.generateCoreResponse(false, false,
         constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4));
      process.exit(1);
   }
});
/**
 * Method to handle the booking create request
 * @param dataObject: The service data.
 * @param jwToken: The user token.
 * @returns {Promise<unknown>}
 */
bookingServices.createBooking = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (validator.validateUndefined(tokenGenerator.validateToken(jwToken))) {
         const booking = new Booking(false, dataObject[constants.BOOKING_TYPE], dataObject[constants.BOOKING_CUSTOMER_ID],
            dataObject[constants.BOOKING_SERVICE_ID]);
         booking.createBooking(dataObject[constants.BOOKING_SUBSCRIPTION_ID], dataObject[constants.EMPLOYEE_ID],
            dataObject[constants.BOOKING_VENDOR_ID], dataObject[constants.BOOKING_TOTAL_AMOUNT])
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
 * Method to search the booking details.
 * @param dataObject: The service data filter.
 * @returns {Promise<Array>}: The response object and the success or error level.
 */
bookingServices.getBookingDetails = (dataObject) => {
   return new Promise((resolve, reject) => {
      //TODO: Search the booking.
   });
};
