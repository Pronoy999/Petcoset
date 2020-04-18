const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');

class Vendor {
   /**
    * _firstName
    * _lastName
    * _email
    * _phone
    * _address1
    * _address2
    * _pincode
    * _city
    * _gender
    * @param vendorId
    * @param firstName
    * @param lastName
    * @param email
    * @param phone
    * @param address1
    * @param address2
    * @param pincode
    * @param city
    * @param gender
    */
   constructor(vendorId, firstName, lastName, email, phone, address1, address2, pincode, city, gender) {
      this._vendorId = validators.validateNumber(vendorId) ? vendorId : false;
      this._firstName = validators.validateString(firstName) ? firstName : false;
      this._lastName = validators.validateString(lastName) ? lastName : false;
      this._email = validators.validateEmail(email) ? email : false;
      this._phone = validators.validatePhone(phone) ? phone : false;
      this._address1 = validators.validateString(address1) ? address1 : false;
      this._address2 = validators.validateString(address2) ? address2 : false;
      this._pincode = validators.validateNumber(pincode) ? pincode : false;
      this._city = validators.validateNumber(city) ? city : false;
      this._gender = validators.validateCharacter(gender) ? gender : false;
   }

   /**
    * Method to register the vendor.
    * @param documentIdentificationNumber: The identification document number.
    * @param documentType: The identification Document Type.
    * @returns {Promise<unknown>}
    */
   createVendor(documentIdentificationNumber, documentType) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_CREATE_VENDOR, [this._firstName, this._lastName, this._email,
            this._phone, this._gender, documentType, documentIdentificationNumber])
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
    * Method to add the vendor service.
    * @param serviceId: The service Id.
    * @param petType: The type of pet.
    * @param isBathing: 1 for bathing provided with the service.
    * @param serviceDuration: The duration of the service.
    * @param serviceCharge: The charge per service.
    * @returns {Promise<Array>}: 1 if completed, else -1.
    */
   createVendorServices(serviceId, petType, isBathing, serviceDuration, serviceCharge) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_ADD_VENDOR_SERVICE, [this._vendorId, serviceId, petType, isBathing, serviceDuration, serviceCharge])
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
    * Method to get the vendor details.
    * @returns {Promise<unknown>}
    */
   getVendor() {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_GET_VENDOR, [this._email, this._phone, this._vendorId])
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
}

/**
 * Exporting the module.
 * @type {Vendor}
 */
module.exports = Vendor;