const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const childProcess = require('child_process');
const vendorHandler = {};
/**
 * Method to handle the vendor endpoint requests.
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
         const gender = validator.validateCharacter(dataObject.postData[constants.VENDOR_GENDER]) ?
            dataObject.postData[constants.VENDOR_GENDER] : false;
         const phoneNumber = validator.validatePhone(dataObject.postData[constants.VENDOR_PHONE_NUMBER]) ?
            dataObject.postData[constants.VENDOR_PHONE_NUMBER] : false;
         const documentIdentificationNumber = validator.validateUndefined(dataObject.postData[constants.DOCUMENT_ID_NUMBER]) ?
            dataObject.postData[constants.DOCUMENT_ID_NUMBER] : false;
         const documentType = validator.validateString(dataObject.postData[constants.DOCUMENT_TYPE]) ?
            dataObject.postData[constants.DOCUMENT_TYPE] : false;
         if (firstName && lastName && email && gender && phoneNumber && documentIdentificationNumber && documentType) {
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_CREATE;
            serviceData[constants.CORE_DATA] = dataObject.postData;
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR]) {
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
         if (email || phoneNumber || vendorId) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.queryString;
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_GET;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR]) {
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
      if (method === constants.HTTP_POST) {
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
         if (vendorId && serviceId && jwToken && serviceCharge) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_TYPE] = constants.CORE_VENDOR_SERVICE_ADD;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/vendor.js`);
            childWorker.send(serviceData);
            childWorker.on("message", (childReply) => {
               if (childReply[constants.CORE_ERROR]) {
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
