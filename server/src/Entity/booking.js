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

   /**
    * Method to create a Subscription service booking.
    * It books a service from an active subscription.
    * @param subscriptionId: The Subscription that the user is buying.
    * @param amount: The amount to be paid.
    * @returns {Promise<unknown>}
    */
   createSubscriptionServiceBooking(subscriptionId, amount) {
      return new Promise((resolve, reject) => {
         //TODO: Create the booking.
      });
   }

   /**
    * Method to create a booking for the subscription plan.
    * @param subscriptionID: The subscription plan id.
    * @param amount: The total amount for the subscription.
    * @param transactionId: The transaction id.
    * @returns {Promise<Number|Object>}: The booking id, else error.
    */
   createSubscriptionBooking(subscriptionID, amount, transactionId) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_SUBSCRIPTION_BOOKING, [this._bookingType,
            this._customerId, subscriptionID, 0, 0, amount, "", "", 0, 0, 0]).then(_resultSet => {
            const result = _resultSet[0];
            if (validators.validateUndefined(result)) {
               resolve(result);
            } else {
               reject(false);
            }
         }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }

   /**
    * Method to create the booking for the service without subscription.
    * @param vendorID: The vendorID
    * @param amount: The amount of booking.
    * @param transactionId: The transaction id for the payment.
    * @returns {Promise<unknown>}
    */
   createServiceBooking(vendorID, amount, transactionId) {
      return new Promise((resolve, reject) => {
         //TODO: Create the booking for the service without the subscription.
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