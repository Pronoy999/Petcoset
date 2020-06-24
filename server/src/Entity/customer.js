const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');
const tokenGenerator = require('./../Services/jwTokenGenerator');
const s3Helper = require('./../Helpers/s3Helper');

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
         database.runSp(constants.SP_GET_CUSTOMER, [this._email, this._phone, this._id])
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

   /**
    * Method to get the address details of the users.
    * @returns {Promise<Array>}: An array of customer address.
    */
   getAddress() {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_GET_CUSTOMER_ADDRESS, [this._id]).then(_resultSet => {
            const result = _resultSet[0];
            if (validators.validateUndefined(result)) {
               resolve(result);
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
    * Method to update the customer details.
    * @returns {Promise<unknown>}
    */
   updateCustomerDetails() {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_UPDATE_CUSTOMER_DETAILS,
            [this._id, this._password, this._phone]).then(_resultSet => {
            resolve(_resultSet[0][0]);
         }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }

   /**
    * method to add customer pet details.
    * @param petType
    * @param petName
    * @param breed
    * @param age
    * @param sex
    * @param weight
    * @returns {Promise<unknown>}: 1 if complete else -1
    */
   addCustomerPetDetails(petType, petName, breed, age, sex, weight) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_CREATE_CUSTOMER_PET_DETAILS,
            [this._id, petType, petName, breed, age, 0, sex, weight]).then(_resultSet => {
            const result = _resultSet[0][0];
            if (validators.validateUndefined(result))
               resolve(result);
            else
               resolve({"id": -1})
         }).catch(err => {
            printer.printError(err);
            reject(err);
         })
      });
   }

   /**
    * Method to get the Pet details of the customer.
    * @returns {Promise<Array>}: An array of pet details.
    */
   getPetDetails() {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_GET_CUSTOMER_PET_DETAILS, [this._id]).then(_resultSet => {
            const result = _resultSet[0];
            if (validators.validateUndefined(result)) {
               resolve(result);
            } else {
               resolve([{id: -1}]);
            }
         }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }

   /**
    * Method to add images to s3 bucket.
    * @param imageData
    * @param imageType
    * @param fileExtension
    * @param position
    * @returns {Promise<unknown>}
    */
   addImages(imageData, imageType, fileExtension, position) {
      return new Promise((resolve, reject) => {
         const imageKey = generator.generateRandomToken(16) + "." + fileExtension;
         const isSecure = (imageType === constants.IMAGE_TYPE_DOCUMENT);
         const baseUrl = (isSecure) ? constants.DOCUMENTS_BASE_URL : constants.IMAGES_BASE_URL;
         const imageUrl = baseUrl + imageKey;
         let promises = [];
         promises.push(s3Helper.uploadFile(imageData, imageKey, isSecure));
         promises.push(database.runSp(constants.SP_UPDATE_CUSTOMER_IMAGES,
            [imageType, imageKey, imageUrl, position, this._id]));
         Promise.all(promises).then(results => {
            resolve(imageUrl);
         }).catch(errs => {
            printer.printError(errs);
            reject(constants.ERROR_MESSAGE);
         });
      });
   }

   /**
    * Method to get the images of the vendor.
    * @param imageType: The image type to be searched.
    * @returns {Promise<Array>}: an array of images.
    */
   getImages(imageType) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_GET_CUSTOMER_IMAGES, [this._id, imageType]).then(_resultSet => {
            const result = _resultSet[0];
            if (validators.validateUndefined(result)) {
               resolve(result);
            } else {
               resolve([]);
            }
         }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }

   /**
    * Method to update the customer pet details.
    * @param petDetailsId: The pet details id.
    * @param petType: The pet type.
    * @param petName: The name of the pet.
    * @param breedId: The breed id.
    * @param petGender: The Gender id.
    * @param petWeight: The pet weight.
    * @param petAgeYr: The pet Age.
    * @param petAgeMonth: The pet age month.
    * @param isDelete: 1 to delete the existing data, else 0.
    * @returns {Promise<JSON>}: The result, 1 if completed, else -1.
    */
   updatePetDetails(petDetailsId, petType, petName, breedId, petGender, petWeight, petAgeYr, petAgeMonth, isDelete) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_UPDATE_CUSTOMER_PET_DETAILS, [
            this._id, petDetailsId,
            validators.validateUndefined(petType) ? petType : "",
            validators.validateUndefined(petName) ? petName : "",
            validators.validateUndefined(breedId) ? breedId : "",
            validators.validateUndefined(petGender) ? petGender : "",
            validators.validateUndefined(petWeight) ? petWeight : "",
            validators.validateUndefined(petAgeYr) ? petAgeYr : "",
            validators.validateUndefined(petAgeMonth) ? petAgeMonth : "",
            validators.validateUndefined(isDelete) ? isDelete : 0
         ]).then(_resultSet => {
            const result = _resultSet[0][0];
            if (validators.validateUndefined(result)) {
               resolve(result);
            } else {
               resolve({id: -1});
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
 */
module.exports = Customer;
