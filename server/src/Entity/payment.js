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
            resolve(false);
         });
      });
   }

   /**
    * Method to create or update the payment status.
    * @param customerId: The customer id for the payment.
    * @returns {Promise<unknown>}
    */
   createPayment(customerId) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_PAYMENT_CREATE, [this._bookingID, this._transactionID,
            constants.STATUS_AUTHORIZED, customerId, this._amount])
            .then(async _resultSet => {
               const result = _resultSet[0][0];
               if (validators.validateUndefined(result)) {
                  this._paymentID = result.id;
                  await this._capturePayment();
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
    * Method to search for payment details.
    * @returns {Promise<unknown>}
    */
   getPayment() {
      return new Promise((resolve, reject) => {
         //TODO: Get the payment details.
      });
   }
}

/**
 * Exporting the module payment.
 * @type {Payment}
 */
module.exports = Payment;