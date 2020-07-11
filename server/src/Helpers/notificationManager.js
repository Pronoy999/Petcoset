const notificationManager = {};
const validator = require('./validators');
const printer = require('./printer');
const aws = require('./awsHelper');
/**
 * Method to send SMS using AWS SNS.
 * @param msg: The message to be send.
 * @param address: The destination mobile number.
 * @returns {Promise<Boolean>}: true if success.
 */
notificationManager.sendSMS = (msg, address) => {
   return new Promise((resolve, reject) => {
      if (!validator.validatePhone(address)) {
         reject(false);
         return;
      }
      if (!address.startsWith("+91")) {
         address = "+91" + address;
      }
      const msgParmas = {
         Message: msg,
         MessageStructure: 'string',
         PhoneNumber: address
      };
      aws.sns.publish(msgParmas, err => {
         if (err) {
            printer.printError(err);
            reject(err);
         } else {
            resolve(true);
         }
      });
   });
};
/**
 * Exporting the notification manager.
 */
module.exports = notificationManager;