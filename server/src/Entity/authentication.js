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

   /**
    * Method to request the Password generate Token.
    * @returns {Promise<Boolean>}
    */
   requestPasswordChangeToken(isProduction) {
      return new Promise((resolve, reject) => {
         const token = generator.generateRandomToken(8);
         const url = (isProduction) ? constants.PASSWORD_CHANGE_URL_PROD : constants.PASSWORD_CHANGE_URL_DEV;
         const emailMessage = constants.PASSWORD_CHANGE_MESSAGE.replace("%l", url + token);
         notificationManager.sendEmail(this._emailId, emailMessage, "Password Change Link.").then(() => {
            database.runSp(constants.SP_GENERATE_AND_VALIDATE_PASSWORD_TOKEN,
               [this._emailId, token, 0, false]).then(_resultSet => {
               const result = _resultSet[0][0];
               if (validators.validateUndefined(result)) {
                  resolve(result);
               } else {
                  result({"id": -1});
               }
            }).catch(err => {
               printer.printError(err);
            });
         }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }

   /**
    * Method to validate the password change token and change the password.
    * @param token: The token of the user.
    * @returns {Promise<unknown>}
    */
   validateTokenAndChangePassword(token) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_GENERATE_AND_VALIDATE_PASSWORD_TOKEN, [this._emailId, token, 1, this._password])
            .then(_resultSet => {
               const result = _resultSet[0][0];
               if (validators.validateUndefined(result)) {
                  resolve(result);
               } else {
                  resolve({id: -1});
               }
            }).catch(err => {
            reject(err);
         });
      });
   }

   /**
    * Method to register using social login.
    * @param firstName: The first name.
    * @param lastName: The last name.
    * @returns {Promise<Object>}: user object details.
    */
   registerFromSocial(firstName, lastName) {
      return new Promise((resolve, reject) => {
         const roleValue = (this._role === constants.ROLE_CUSTOMER_KEY) ? constants.ROLE_CUSTOMER_VALUE : constants.ROLE_VENDOR_VALUE;
         database.runSp(constants.SP_SOCIAL_REGISTER, [firstName, lastName, this._emailId, this._password, roleValue])
            .then(_resultSet => {
               const result = _resultSet[0][0];
               if (validators.validateUndefined(result) && result.id > 0) {
                  const resultObj = {};
                  resultObj[constants.CUSTOMER_FIRST_NAME] = firstName;
                  resultObj[constants.CUSTOMER_LAST_NAME] = lastName;
                  resultObj[constants.CUSTOMER_EMAIL] = this._emailId;
                  resultObj[constants.ROLE_KEY] = this._role;
                  resultObj[constants.USER_ID] = result.id;
                  resultObj[constants.JW_TOKEN] = tokenGenerator.getToken(resultObj);
                  resolve(resultObj);
               } else {
                  resolve({});
               }
            }).catch(err => {
            reject(err);
         });
      });
   }
}

/**
 * Exporting the authentication class.
 */
module.exports = Authentication;
