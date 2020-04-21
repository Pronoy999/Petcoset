const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');
const tokenGenerator = require('./../Services/jwTokenGenerator');

const Authentication = require('./authentication');

class Vendor {
   /**
    * _vendorId
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
    * @param password: the vendor login password.
    * @param documentIdentificationNumber: The identification document number.
    * @param documentType: The identification Document Type.
    * @returns {Promise<unknown>}
    */
   createVendor(password, documentIdentificationNumber, documentType) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_CREATE_VENDOR, [this._firstName, this._lastName, this._email, password,
               this._phone, this._gender, documentType, documentIdentificationNumber])
            .then(async _resultSet => {
               try {
                  const result = _resultSet[0][0];
                  if (validators.validateUndefined(result)) {
                     result[constants.TWO_FACTOR_KEY] = true;
                     const authentication = new Authentication();
                     await authentication.requestOtp(this._phone);
                     resolve(result);
                  } else {
                     resolve({"id": -1});
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
               let result = _resultSet[0][0];
               if (validators.validateUndefined(result)) {
                  result = JSON.stringify(result);
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
    * Method to verify the 2F mobile number of the vendor.
    * @param otp: The OTP entered by the vendor.
    * @returns {Promise<unknown>}
    */
   verify2F(otp) {
      return new Promise(async (resolve, reject) => {
         const authentication = new Authentication();
         try {
            const vendorDetails = generator.generateParsedJSON(await this.getVendor());
            this._phone = vendorDetails[constants.VENDOR_PHONE_NUMBER];
            if (await authentication.verifyOtp(this._phone, otp) > 0) {
               vendorDetails[constants.JW_TOKEN] = tokenGenerator.getToken(vendorDetails);
               resolve(vendorDetails);
            } else {
               resolve(constants.INCORRECT_OTP);
            }
         } catch (e) {
            printer.printError(e);
            reject(e);
         }
      });
   }
   
   /**
    * Method to create the bank details of the vendor.
    * @param accountHolderName: The account holder Name.
    * @param accountNumber: The account holder name.
    * @param bankName: The name of the bank.
    * @param ifscCode: The IFSC code.
    * @param isUpdate: 1 to update the existing value. 0 to create new.
    * @returns {Promise<unknown>}
    */
   createUpdateBankDetails(accountHolderName, accountNumber, bankName, ifscCode, isUpdate) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_CREATE_BANK_DETAILS, [this._vendorId, "tbl_VendorMaster", accountHolderName,
               accountNumber, bankName, ifscCode, this._phone, '', 0, isUpdate])
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
    * Method to update the vendor details.
    * @param password: The password of the vendor.
    * @returns {Promise<unknown>}
    */
   updateVendorDetails(password) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_UPDATE_VENDOR_DETAILS, [this._vendorId, this._email,
               validators.validateUndefined(password) ? password : false,
               this._phone, this._address1, this._address2, this._city, this._pincode])
            .then(_resultSet => {
               const result = _resultSet[0][0];
               if (validators.validateUndefined(result)) {
                  resolve(result);
               } else {
                  resolve(false);
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