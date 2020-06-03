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
      (bookingType === constants.BOOKING_TYPE_SERVICE || bookingType === constants.BOOKING_TYPE_SUBSCRIPTION ||
         bookingType === constants.BOOKING_TYPE_SUBSCRIPTION_SERVICE) ?
         bookingType : false;
      this._customerId = validators.validateNumber(customerId) ? customerId : false;
      this._serviceId = validators.validateNumber(serviceId) ? serviceId : false;
   }

   /**
    * Method to create and capture the payment for the booking.
    * @param transactionId: the transaction id of the booking.
    * @param amount: The amount of the booking.
    * @returns {Promise<unknown>}
    * @private
    */
   _createPaymentForBooking(transactionId, amount) {
      return new Promise((resolve, reject) => {
         const payment = new Payment(this._bookingId, transactionId, amount);
         payment.createPayment(this._customerId).then(paymentId => {
            printer.printHighlightedLog("Payment Created for booking: " + this._bookingId);
            resolve(paymentId);
         }).catch(err => {
            printer.printError(err);
            printer.printError("Payment not created for booking ID: " + this._bookingId);
            reject(err);
         });
      });
   }

   /**
    * Method to create a Subscription's service booking.
    * It books a service from an active subscription.
    * @param subscriptionId: The Subscription that the user is buying.
    * @param addressId: The address id of the customer.
    * @param bookingTime: The booking date.
    * @param bookingDate: The booking time.
    * @param recurringBookings: The array containing the recurring dates and time.
    * @returns {Promise<Number>}: The booking id.
    */
   createSubscriptionServiceBooking(subscriptionId, addressId, bookingTime, bookingDate, recurringBookings) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_HANDLE_BOOKING, [constants.BOOKING_TYPE_SUBSCRIPTION_SERVICE, this._customerId,
            subscriptionId, this._serviceId, 0, 0, bookingDate, bookingTime, addressId, 0, 0]).then(_resultSet => {
            const result = _resultSet[0][0];
            if (validators.validateUndefined(result) && result.id > 0) {
               this._bookingId = result.id;
               if (validators.validateUndefined(recurringBookings)) {
                  let recurringDates = [];
                  let recurringTimes = [];
                  recurringBookings.forEach(oneBooking => {
                     recurringDates.push(oneBooking[constants.BOOKING_DATE]);
                     recurringTimes.push(oneBooking[constants.BOOKING_TIME]);
                  });
                  database.runSp(constants.SP_STORE_RECURRING_BOOKING, [recurringDates.join(","),
                     recurringTimes.join(","), this._bookingId]).then(_resultSet => {
                     const result = _resultSet[0][0];
                     resolve(result);
                  }).catch(err => {
                     printer.printError(err);
                     reject(err);
                  });
               } else {
                  resolve(result);
               }
            } else {
               resolve({id: -1});
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
         database.runSp(constants.SP_HANDLE_BOOKING, [constants.BOOKING_TYPE_SUBSCRIPTION, this._customerId, subscriptionID,
            0, 0, amount, generator.generateCurrentDateOnly(), '', 0, 0, 0]).then(async _resultSet => {
            try {
               const result = _resultSet[0][0];
               if (validators.validateUndefined(result) && result.id > 0) {
                  this._bookingId = result.id;
                  await this._createPaymentForBooking(transactionId, amount);
                  resolve(result);
               } else {
                  resolve({id: -1});
               }
            } catch (e) {
               printer.printError(e);
               reject(e);
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
    * @param bookingDate: The booking date.
    * @param bookingTime: The booking time.
    * @param addressId: The address of the customer.
    * @param recurringBookings: The array containing the recurring dates and time.
    * @returns {Promise<Object>}: The booking id.
    */
   createServiceBooking(vendorID, amount, transactionId, bookingDate, bookingTime, addressId, recurringBookings) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_HANDLE_BOOKING, [constants.BOOKING_TYPE_SERVICE, this._customerId,
            0, this._serviceId, vendorID, amount, bookingDate, bookingTime, addressId, 0, 0]).then(async _resultSet => {
            try {
               const result = _resultSet[0][0];
               if (validators.validateUndefined(result) && result.id > 0) {
                  this._bookingId = result.id;
                  await this._createPaymentForBooking(transactionId, amount);
                  if (validators.validateUndefined(recurringBookings)) {
                     let recurringDates = [];
                     let recurringTimes = [];
                     recurringBookings.forEach(oneBooking => {
                        recurringDates.push(oneBooking[constants.BOOKING_DATE]);
                        recurringTimes.push(oneBooking[constants.BOOKING_TIME]);
                     });
                     database.runSp(constants.SP_STORE_RECURRING_BOOKING, [recurringDates.join(","),
                        recurringTimes.join(","), this._bookingId]).then(_resultSet => {
                        const result = _resultSet[0][0];
                        resolve(result);
                     }).catch(err => {
                        printer.printError(err);
                        reject(err);
                     });
                  } else {
                     resolve(result);
                  }
               } else {
                  resolve({id: -1});
               }
            } catch (e) {
               printer.printError(e);
               reject(e);
            }
         }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }

   /**
    * Method to get the booking details.
    * @returns {Promise<Array>}: An array of booking details.
    */
   getBookingDetails() {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_GET_BOOKING_DETAILS, [this._customerId, this._bookingId]).then(_resultSet => {
            const result = _resultSet[0];
            if (validators.validateUndefined(result)) {
               resolve(result);
            } else {
               resolve([{id: -1}]);
            }
         }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }
}

/**
 * Exporting the module Booking.
 * @type {Booking}
 */
module.exports = Booking;