const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');
const encrypterDecrypter = require('./../Helpers/encrypterDecrypter');
const RazorPay = require('razorpay');

class Payment {
   /**
    * _bookingID
    * _transactionID
    * _amount
    * _paymentID
    * @param bookingID
    * @param transactionID
    * @param amount
    * @param paymentID
    */
   constructor(bookingID, transactionID, amount, paymentID) {
      this._bookingID = validators.validateNumber(bookingID) ? bookingID : false;
      this._transactionID = validators.validateString(transactionID) ? transactionID : false;
      this._amount = validators.validateNumber(amount) ? amount : false;
      this._paymentID = validators.validateNumber(paymentID) ? paymentID : false;
   }

   /**
    * Method to create or update the payment status.
    * @returns {Promise<Number>}: The paymentID
    */
   createPayment() {
      return new Promise((resolve, reject) => {
         //TODO: Create the payment details.
      });
   }

   /**
    * Method to search for payment details.
    * @returns {Promise<unknown>}
    */
   getPayment() {
      return new Promise((resolve, reject) => {
         //TODO: Get the payment details.
      });
   }

   /**
    * Method to capture the RazorPay payment.
    * @returns {Promise<unknown>}
    * @private
    */
   _capturePayment() {
      return new Promise((resolve, reject) => {
         let razorPayConfig = {};
         razorPayConfig[constants.RAZOR_PAY_ID] = encrypterDecrypter.decrypt(process.env[constants.RAZOR_PAY_ID]);
         razorPayConfig[constants.RAZOR_PAY_SECRET] = encrypterDecrypter.decrypt(process.env[constants.RAZOR_PAY_SECRET]);
         const razorpayInstance = new RazorPay(razorPayConfig);
         razorpayInstance.payments.capture(this._transactionID, this._amount * 100).then(() => {
            printer.printHighlightedLog("Payment Captured for :" + this._transactionID);
            resolve(true);
         }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }
}

/**
 * Exporting the module payment.
 * @type {Payment}
 */
module.exports = Payment;