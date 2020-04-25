const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const childProcess = require('child_process');
const vendorHandler = {};
/**
 * Method to handle the vendor endpoint requests.
 * It will register, search and update vendors and its details.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: Response code and response object.
 */
vendorHandler.vendor = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const firstName = validator.validateString(dataObject.postData[constants.VENDOR_FIRST_NAME]) ?
            dataObject.postData[constants.VENDOR_FIRST_NAME] : false;
         const lastName = validator.validateString(dataObject.postData[constants.VENDOR_LAST_NAME]) ?
            dataObject.postData[constants.VENDOR_LAST_NAME] : false;
         const email = validator.validateEmail(dataObject.postData[constants.VENDOR_EMAIL]) ?
            dataObject.postData[constants.VENDOR_EMAIL] : false;
         const password = validator.validateString(dataObject.postData[constants.VENDOR_PASSWORD]) ?
            dataObject.postData[constants.VENDOR_PASSWORD] : false;
         const gender = validator.validateCharacter(dataObject.postData[constants.VENDOR_GENDER]) ?
            dataObject.postData[constants.VENDOR_GENDER] : false;
         const phoneNumber = validator.validatePhone(dataObject.postData[constants.VENDOR_PHONE_NUMBER]) ?
            dataObject.postData[constants.VENDOR_PHONE_NUMBER] : false;
         const documentIdentificationNumber = validator.validateUndefined(dataObject.postData[constants.DOCUMENT_ID_NUMBER]) ?
            dataObject.postData[constants.DOCUMENT_ID_NUMBER] : false;
         const documentType = validator.validateString(dataObject.postData[constants.DOCUMENT_TYPE]) ?
            dataObject.postData[constants.DOCUMENT_TYPE] : false;
         if (firstName && lastName && email && password && gender && phoneNumber && documentIdentificationNumber && documentType) {
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_CREATE;
            serviceData[constants.CORE_DATA] = dataObject.postData;
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else if (method === constants.HTTP_GET) {
         const email = validator.validateEmail(dataObject.queryString[constants.VENDOR_EMAIL]) ?
            dataObject.queryString[constants.VENDOR_EMAIL] : false;
         const phoneNumber = validator.validatePhone(dataObject.queryString[constants.VENDOR_PHONE_NUMBER]) ?
            dataObject.queryString[constants.VENDOR_PHONE_NUMBER] : false;
         const vendorId = validator.validateNumber(dataObject.queryString[constants.VENDOR_ID]) ?
            dataObject.queryString[constants.VENDOR_ID] : false;
         const vendorStatus = validator.validateString(dataObject.queryString[constants.VENDOR_STATUS]) ?
            dataObject.queryString[constants.VENDOR_STATUS] : false;
         if (email || phoneNumber || vendorId || vendorStatus) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.queryString;
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_GET;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else if (method === constants.HTTP_PUT) {
         const vendorId = validator.validateNumber(dataObject.postData[constants.VENDOR_ID]) ?
            dataObject.postData[constants.VENDOR_ID] : false;
         const email = validator.validateEmail(dataObject.postData[constants.VENDOR_EMAIL]) ?
            dataObject.postData[constants.VENDOR_EMAIL] : false;
         const password = validator.validateString(dataObject.postData[constants.VENDOR_PASSWORD]) ?
            dataObject.postData[constants.VENDOR_PASSWORD] : false;
         const phoneNumber = validator.validatePhone(dataObject.postData[constants.VENDOR_PHONE_NUMBER]) ?
            dataObject.postData[constants.VENDOR_PHONE_NUMBER] : false;
         const address1 = validator.validateString(dataObject.postData[constants.VENDOR_ADDRESS_1]) ?
            dataObject.postData[constants.VENDOR_ADDRESS_1] : false;
         const address2 = validator.validateString(dataObject.postData[constants.VENDOR_ADDRESS_2]) ?
            dataObject.postData[constants.VENDOR_ADDRESS_2] : false;
         const cityId = validator.validateNumber(dataObject.postData[constants.VENDOR_CITY]) ?
            dataObject.postData[constants.VENDOR_CITY] : false;
         const pincode = validator.validateNumber(dataObject.postData[constants.VENDOR_PINCODE]) ?
            dataObject.postData[constants.VENDOR_PINCODE] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ?
            dataObject[constants.JW_TOKEN] : false;
         if (vendorId && jwToken && (email || password || phoneNumber || address1 || address2 || cityId || pincode)) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_UPDATE;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else {
         reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
      }
   });
};
/**
 * Method to handle the vendor service.
 * @param dataObject: The request object.
 * @returns {Promise<unknown>}
 */
vendorHandler.vendorService = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_GET) {
         const vendorId = validator.validateNumber(dataObject.queryString[constants.VENDOR_ID]) ?
            dataObject.queryString[constants.VENDOR_ID] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ?
            dataObject[constants.JW_TOKEN] : false;
         if (vendorId && jwToken) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.queryString;
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_SERVICE_GET;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else if (method === constants.HTTP_POST) {
         const vendorId = validator.validateNumber(dataObject.postData[constants.VENDOR_ID]) ?
            dataObject.postData[constants.VENDOR_ID] : false;
         const serviceId = validator.validateNumber(dataObject.postData[constants.SERVICE_ID]) ?
            dataObject.postData[constants.SERVICE_ID] : false;
         const petType = validator.validateString(dataObject.postData[constants.VENDOR_PET_TYPE]) ?
            dataObject.postData[constants.VENDOR_PET_TYPE] : false;
         const isBathing = validator.validateNumber(dataObject.postData[constants.VENDOR_IS_BATHING_PROVIDED]) ?
            dataObject.postData[constants.VENDOR_IS_BATHING_PROVIDED] : false;
         const duration = validator.validateNumber(dataObject.postData[constants.VENDOR_SERVICE_DURATION]) ?
            dataObject.postData[constants.VENDOR_SERVICE_DURATION] : false;
         const serviceCharge = validator.validateNumber(dataObject.postData[constants.VENDOR_SERVICE_CHARGE]) ?
            dataObject.postData[constants.VENDOR_SERVICE_CHARGE] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ? dataObject[constants.JW_TOKEN] : false;
         if (vendorId && serviceId && jwToken && duration && serviceCharge) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_SERVICE_ADD;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else {
         reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
      }
   });
};
/**
 * Method to handle the 2F verification for the vendor.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: the response code and the response object.
 */
vendorHandler.twoFactor = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const otp = validator.validateNumber(dataObject.postData[constants.OTP]) ? dataObject.postData[constants.OTP] : false;
         const vendorId = validator.validateNumber(dataObject.postData[constants.VENDOR_ID]) ?
            dataObject.postData[constants.VENDOR_ID] : false;
         if (otp && vendorId) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CUSTOMER_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_2F_VERIFY;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else {
         reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
      }
   });
};
/**
 * Method to handle all the bank account details.
 * Search, create and update bank account details.
 * @param dataObject: the request object.
 * @returns {Promise<Array>}: response object and the response code.
 */
vendorHandler.details = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_GET) {
         const vendorId = validator.validateNumber(dataObject.queryString[constants.VENDOR_ID]) ?
            dataObject.queryString[constants.VENDOR_ID] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ? dataObject[constants.JW_TOKEN] : false;
         if (vendorId && jwToken) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.queryString;
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_BANK_GET;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else if (method === constants.HTTP_POST) {
         const holderId = validator.validateNumber(dataObject.postData[constants.BANK_ACCOUNT_HOLDER_ID]) ?
            dataObject.postData[constants.BANK_ACCOUNT_HOLDER_ID] : false;
         const holderName = validator.validateString(dataObject.postData[constants.BANK_ACCOUNT_HOLDER_NAME]) ?
            dataObject.postData[constants.BANK_ACCOUNT_HOLDER_NAME] : false;
         const accountNumber = validator.validateNumber(dataObject.postData[constants.BANK_ACCOUNT_ACCOUNT_NUMBER]) ?
            dataObject.postData[constants.BANK_ACCOUNT_ACCOUNT_NUMBER] : false;
         const bankName = validator.validateString(dataObject.postData[constants.BANK_ACCOUNT_BANK_NAME]) ?
            dataObject.postData[constants.BANK_ACCOUNT_BANK_NAME] : false;
         const ifscCode = validator.validateString(dataObject.postData[constants.BANK_ACCOUNT_IFSC_CODE]) ?
            dataObject.postData[constants.BANK_ACCOUNT_IFSC_CODE] : false;
         const contactNumber = validator.validatePhone(dataObject.postData[constants.BANK_ACCOUNT_CONTACT_NUMBER]) ?
            dataObject.postData[constants.BANK_ACCOUNT_CONTACT_NUMBER] : false;
         const isUpdate = validator.validateNumber(dataObject.postData[constants.BANK_ACCOUNT_IS_UPDATE]) ?
            dataObject.postData[constants.BANK_ACCOUNT_IS_UPDATE] : 1;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ? dataObject[constants.JW_TOKEN] : false;
         if (holderId && holderName && accountNumber && bankName && ifscCode && contactNumber && jwToken) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_BANK;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else if (method === constants.HTTP_PUT) {
         const paymentGatewayAccountId = validator.validateString(dataObject.postData[constants.BANK_ACCOUNT_PAYMENT_GATEWAY_ID]) ?
            dataObject.postData[constants.BANK_ACCOUNT_PAYMENT_GATEWAY_ID] : false;
         const accountNumber = validator.validateNumber(dataObject.postData[constants.BANK_ACCOUNT_ACCOUNT_NUMBER]) ?
            dataObject.postData[constants.BANK_ACCOUNT_ACCOUNT_NUMBER] : false;
         const vendorId = validator.validateNumber(dataObject.postData[constants.VENDOR_ID]) ?
            dataObject.postData[constants.VENDOR_ID] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ? dataObject[constants.JW_TOKEN] : false;
         if (paymentGatewayAccountId && accountNumber && vendorId && jwToken) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_BANK_UPDATE;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else {
         reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
      }
   });
};
/**
 * Method to handle the vendor booking related requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: the response object and the code.
 */
vendorHandler.booking = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_GET) {
         const vendorId = validator.validateNumber(dataObject.queryString[constants.VENDOR_ID]) ?
            dataObject.queryString[constants.VENDOR_ID] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ?
            dataObject[constants.JW_TOKEN] : false;
         if (vendorId && jwToken) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.queryString;
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_GET_BOOKINGS;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]));
               } else {
                  resolve(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else {
         reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
      }
   });
};
/**
 * Exporting the vendor module.
 */
module.exports = vendorHandler;
