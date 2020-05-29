const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');
const tokenGenerator = require('./../Services/jwTokenGenerator');

class Customer {
   /**
    * _firstName
    * _lastName
    * _email
    * _password
    * _phone
    * _gender
    * _address1
    * _address2
    * _city
    * _pincode
    */
   constructor(id, firstName, lastName, email, password, phone, gender) {
      this._id = validators.validateNumber(id) ? id : false;
      this._firstName = validators.validateString(firstName) ? firstName : false;
      this._lastName = validators.validateString(lastName) ? lastName : false;
      this._email = validators.validateEmail(email) ? email : false;
      this._password = validators.validateString(password) ? password : false;
      this._phone = validators.validatePhone(phone) ? phone : false;
      this._gender = validators.validateCharacter(gender) ? gender : false;
   }
   
   /**
    * Method to create the customer.
    * @param {String} usedReferralCode
    */
   createCustomer(usedReferralCode) {
      return new Promise((resolve, reject) => {
         this._ownReferalCode = generator.generateRandomToken(6);
         database.runSp(constants.SP_CREATE_CUSTOMER, [this._firstName, this._lastName, this._email,
            this._password, this._phone, this._gender, this._ownReferalCode,
            validators.validateUndefined(usedReferralCode) ? usedReferralCode : false
         ]).then(_resultSet => {
            const result = _resultSet[0][0];
            let response = {};
            if (validators.validateUndefined(result) && result.id > 0) {
               this._id = result.id;
               let customerData = {};
               customerData[constants.CUSTOMER_FIRST_NAME] = this._firstName;
               customerData[constants.CUSTOMER_LAST_NAME] = this._lastName;
               customerData[constants.CUSTOMER_EMAIL] = this._email;
               customerData[constants.CUSTOMER_ID] = this._id;
               response[constants.JW_TOKEN] = tokenGenerator.getToken(customerData);
               response[constants.CUSTOMER_ID] = this._id;
               resolve(response);
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
    * Method to get the customer data.
    */
   getCustomerDetails() {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_GET_CUSTOMER, [this._email, this._password, this._phone, this._id])
            .then(_resultSet => {
               const result = _resultSet[0][0];
               if (validators.validateUndefined(result)) {
                  resolve(result);
               } else {
                  resolve({"id": -1});
               }
            }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }
   
   /**
    * Method to add address for a customer.
    * @param address1: The address 1
    * @param address2: The address 2.
    * @param cityId: The city id.
    * @param pincode: The pincode.
    * @param isDefault: 1 for default address, else 0.
    * @returns {Promise<Array>}
    */
   addCustomerAddress(address1, address2, cityId, pincode, isDefault) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_UPDATE_CUSTOMER_ADDRESS, [this._id, address1, address2, cityId, pincode,
               validators.validateUndefined(isDefault) ? isDefault : 0])
            .then(_resultSet => {
               resolve(_resultSet[0][0]);
            }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }
}

/**
 * Exporting the module.
 */
module.exports = Customer;
