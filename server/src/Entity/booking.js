const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');

class Booking {
   /**
    * _bookingId
    * _bookingType
    * _customerId
    * _serviceId
    * @param bookingId
    * @param bookingType
    * @param customerId
    * @param serviceId
    */
   constructor(bookingId, bookingType, customerId, serviceId) {
      this._bookingId = validators.validateNumber(bookingId) ? bookingId : false;
      this._bookingType = validators.validateString(bookingType) &&
      (bookingType === constants.BOOKING_TYPE_SERVICE || bookingType === constants.BOOKING_TYPE_SUBSCRIPTION) ?
         bookingType : false;
      this._customerId = validators.validateNumber(customerId) ? customerId : false;
      this._serviceId = validators.validateNumber(serviceId) ? serviceId : false;
   }

   createBooking(subscriptionId, employeeId, vendorId, amount) {
      return new Promise((resolve, reject) => {
         //TODO: Create the booking.
      });
   }

   /**
    * Method to get the booking details.
    * @returns {Promise<unknown>}
    */
   getBookingDetails() {
      return new Promise((resolve, reject) => {

      });
   }
}

/**
 * Exporting the module Booking.
 * @type {Booking}
 */
module.exports = Booking;