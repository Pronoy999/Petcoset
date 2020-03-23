const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const tokenGenerator = require('./../Services/jwTokenGenerator');

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
               authObj[constants.JW_TOKEN] = tokenGenerator.getToken(result);
               authObj[constants.USER_DATA] = result;
               resolve(authObj);
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
