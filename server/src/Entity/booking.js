const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');
const Payment = require('./payment');

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
    * Method to create and capture the payment for the booking.
    * @param transactionId: the transaction id of the booking.
    * @param amount: The amount of the booking.
    * @private
    */
   _createPaymentForBooking(transactionId, amount) {
      const payment = new Payment(this._bookingId, transactionId, amount);
      payment.createPayment(this._customerId).then(paymentId => {
         printer.printHighlightedLog("Payment Created for booking: " + this._bookingId);
      }).catch(err => {
         printer.printError(err);
         printer.printError("Payment not created for booking ID: " + this._bookingId);
      });
   }

   /**
    * Method to create a Subscription service booking.
    * It books a service from an active subscription.
    * @param subscriptionId: The Subscription that the user is buying.
    * @param address1: the customer booking address1.
    * @param address2: The customer booking address 2.
    * @param cityId: The city Id.
    * @param pincode: The pincode.
    * @returns {Promise<Number>}: The booking id.
    */
   createSubscriptionServiceBooking(subscriptionId, address1, address2, cityId, pincode) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_BOOKING_SUBS_SERVICE, [this._customerId, subscriptionId, this._serviceId,
            address1, address2, cityId, pincode, 0]).then(_resultSet => {
            const result = _resultSet[0][0];
            if (validators.validateUndefined(result)) {
               this._bookingId = result.id;
               resolve(this._bookingId);
            } else {
               resolve(false);
            }
         }).catch(err => {
            printer.printError(err);
            reject(err);
         });
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
            const result = _resultSet[0][0];
            if (validators.validateUndefined(result)) {
               this._bookingId = result.id;
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
         //TODO: search for booking.
      });
   }
}

/**
 * Exporting the module Booking.
 * @type {Booking}
 */
module.exports = Booking;