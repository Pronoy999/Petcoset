const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const generator = require('./../Services/generator');
const tokenGenerator = require('./../Services/jwTokenGenerator');
const notificationManager = require('./../Helpers/notificationManager');

class Authentication {
   /**
    * _emailId
    * _password
    * _role
    * @param emailId
    * @param password
    * @param role
    */
   constructor(emailId, password, role) {
      this._emailId = validators.validateEmail(emailId) ? emailId : false;
      this._password = validators.validateString(password) ? password : false;
      this._role = validators.validateString(role) ? role : false;
   }
   
   /**
    * Method to check the validity of the login.
    * @returns {Promise<Array>}: the details of the user after successful login.
    */
   checkValidity() {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_LOGIN, [this._emailId, this._password])
            .then(_resultSet => {
               const result = _resultSet[0][0];
               const authObj = {};
               if (result.id > 0) {
                  authObj[constants.JW_TOKEN] = tokenGenerator.getToken(generator.generateParsedJSON(result));
               }
               authObj[constants.USER_DATA] = result;
               resolve(authObj);
            }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }
   
   /**
    * Method to send OTP to the user.
    * @param mobileNumber: the mobile number of the user.
    * @returns {Promise<unknown>}
    */
   requestOtp(mobileNumber) {
      return new Promise((resolve, reject) => {
         const otp = generator.generateOTP();
         try {
            database.runSp(constants.SP_OTP, [mobileNumber, otp, 0]).then(async _resultSet => {
               const result = _resultSet[0][0];
               if (validators.validateUndefined(result) && result.id > 0) {
                  const otpMsg = constants.OTP_MESSAGE + otp;
                  await notificationManager.sendSMS(otpMsg, mobileNumber);
                  resolve(true);
               } else {
                  reject(false);
               }
            }).catch(err => {
               printer.printError(err);
               reject(err);
            });
         } catch (e) {
            printer.printError(e);
            reject(e);
         }
      });
   }
   
   /**
    * Method to verify the OTP from the user.
    * @param mobileNumber: The mobile number.
    * @param otp: The OTP of the user.
    * @returns {Promise<unknown>}
    */
   verifyOtp(mobileNumber, otp) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_OTP, [mobileNumber, otp, 1]).then(_resultSet => {
            const result = _resultSet[0][0];
            if (validators.validateUndefined(result) && result.id > 0) {
               resolve(true);
            } else {
               resolve(-1);
            }
         }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }
}

/**
 * Exporting the authentication class.
 * @type {Authentication}
 */
module.exports = Authentication;
