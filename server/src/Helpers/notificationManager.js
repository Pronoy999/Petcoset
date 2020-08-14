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
 * Method to send email to a specified address.
 * @param targetAddress: The target address.
 * @param emailBody: the email body.
 * @param subject: The subject of the email.
 * @returns {Promise<Boolean>}: true, if email is send successfully.
 */
notificationManager.sendEmail = (targetAddress, emailBody, subject) => {
   return new Promise((resolve, reject) => {
      const params = {
         Destination: {
            CcAddresses: [],
            ToAddresses: [targetAddress]
         },
         Message: {
            Body: {
               Html: {
                  Charset: "UTF-8",
                  Data: emailBody
               },
               Text: {
                  Charset: "UTF-8",
                  Data: emailBody
               }
            },
            Subject: {
               Charset: 'UTF-8',
               Data: subject
            }
         },
         Source: 'noreply@petcoset.com'
      };
      aws.ses.sendEmail(params).then(data => {
         printer.printLog(data);
         resolve(true);
      }).catch(err => {
         printer.printError(err);
         reject(err);
      });
   });
};
/**
 * Exporting the notification manager.
 */
module.exports = notificationManager;