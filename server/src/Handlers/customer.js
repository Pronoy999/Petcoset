const customerHandler = {};
const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const childProcess = require('child_process');
/**
 * Method to handle the customer requests.
 */
customerHandler.customer = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const firstName = validator.validateString(dataObject.postData[constants.CUSTOMER_FIRST_NAME]) ?
            dataObject.postData[constants.CUSTOMER_FIRST_NAME] : false;
         const lastName = validator.validateString(dataObject.postData[constants.CUSTOMER_LAST_NAME]) ?
            dataObject.postData[constants.CUSTOMER_LAST_NAME] : false;
         const email = validator.validateEmail(dataObject.postData[constants.CUSTOMER_EMAIL]) ?
            dataObject.postData[constants.CUSTOMER_EMAIL] : false;
         const phoneNumber = validator.validatePhone(dataObject.postData[constants.CUSTOMER_PHONE_NUMBER]) ?
            dataObject.postData[constants.CUSTOMER_PHONE_NUMBER] : false;
         const gender = validator.validateCharacter(dataObject.postData[constants.CUSTOMER_GENDER]) ?
            dataObject.postData[constants.CUSTOMER_GENDER] : false;
         const password = validator.validateString(dataObject.postData[constants.CUSTOMER_PASSWORD]) ?
            dataObject.postData[constants.CUSTOMER_PASSWORD] : false;
         const usedCode = validator.validateString(dataObject.postData[constants.CUSTOMER_USED_REFERAL_CODE]) ?
            dataObject.postData[constants.CUSTOMER_USED_REFERAL_CODE] : null;
         if (firstName && lastName && email && phoneNumber && password && gender) {
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/customer.js`);
            let serviceData = {};
            dataObject.postData[constants.CUSTOMER_USED_REFERAL_CODE] = usedCode;
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TYPE] = constants.CORE_CUSTOMER_CREATE;
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
      } else if (dataObject.method === constants.HTTP_GET) {
         const email = validator.validateEmail(dataObject.queryString[constants.CUSTOMER_EMAIL]) ?
            dataObject.queryString[constants.CUSTOMER_EMAIL] : false;
         const phoneNumber = validator.validateNumber(dataObject.queryString[constants.CUSTOMER_PHONE_NUMBER]) ?
            dataObject.queryString[constants.CUSTOMER_PHONE_NUMBER] : false;
         const id = validator.validateNumber(dataObject.queryString[constants.CUSTOMER_ID]) ?
            dataObject.queryString[constants.CUSTOMER_ID] : -1;
         if (email || phoneNumber || id) {
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/customer.js`);
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TYPE] = constants.CORE_CUSTOMER_GET;
            serviceData[constants.CORE_DATA] = dataObject.queryString;
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
 * Method to handle the customer address requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response object and the response code.
 */
customerHandler.address = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const address1 = validator.validateString(dataObject.postData[constants.CUSTOMER_ADDRESS_1]) ?
            dataObject.postData[constants.CUSTOMER_ADDRESS_1] : false;
         const address2 = validator.validateString(dataObject.postData[constants.CUSTOMER_ADDRESS_2]) ?
            dataObject.postData[constants.CUSTOMER_ADDRESS_2] : false;
         const cityId = validator.validateNumber(dataObject.postData[constants.CUSTOMER_CITY]) ?
            dataObject.postData[constants.CUSTOMER_CITY] : false;
         const pincode = validator.validateNumber(dataObject.postData[constants.CUSTOMER_PINCODE]) ?
            dataObject.postData[constants.CUSTOMER_PINCODE] : false;
         const customerId = validator.validateNumber(dataObject.postData[constants.CUSTOMER_ID]) ?
            dataObject.postData[constants.CUSTOMER_ID] : false;
         const jwToken = validator.validateUndefined(dataObject[constants.JW_TOKEN]) ?
            dataObject[constants.JW_TOKEN] : false;
         if (customerId && jwToken && address1 && address2 && cityId && pincode) {
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/customer.js`);
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_TYPE] = constants.CORE_CUSTOMER_ADDRESS_CREATE;
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TOKEN] = dataObject[constants.JW_TOKEN];
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
 * Method to handle the customer requested service.
 * @param dataObject
 * @returns {Promise<unknown>}
 */
customerHandler.customerService = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_GET) {
         //TODO: method will return customer registered services.
      } else if (method === constants.HTTP_POST) {
         const customerId = validator.validateNumber(dataObject.postData[constants.CUSTOMER_ID]) ?
            dataObject.postData[constants.CUSTOMER_ID] : false;
         const jwToken = validator.validateString(dataObject.postData[constants.JW_TOKEN]) ?
            dataObject.postData[constants.JW_TOKEN] : false;
         if (customerId && jwToken) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_TYPE] = constants.CORE_CUSTOMER_SERVICE_ADD;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/customer.js`);
            childWorker.send(serviceData);
            childWorker.on('message', (childReply) => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE), childReply[constants.CORE_ERROR_LEVEL]);
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

customerHandler.petDetails = (dataObject) => {
   return new Promise((resolve, reject) => {
      const method = dataObject.method;
      if (method === constants.HTTP_POST) {
         const customerId = validator.validateNumber(dataObject.postData[constants.CUSTOMER_ID]) ?
            dataObject.postData[constants.CUSTOMER_ID] : false;
         const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ?
            dataObject[constants.JW_TOKEN] : false;
         const petType = validator.validateString(dataObject.postData[constants.CUSTOMER_PET_TYPE]) ?
            dataObject.postData[constants.CUSTOMER_PET_TYPE] : false;
         const petName = validator.validateString(dataObject.postData[constants.CUSTOMER_PET_NAME]) ?
            dataObject.postData[constants.CUSTOMER_PET_NAME] : false;
         const breed = validator.validateNumber(dataObject.postData[constants.CUSTOMER_PET_BREED]) ?
            dataObject.postData[constants.CUSTOMER_PET_BREED] : false;
         const pet_age = validator.validateNumber(dataObject.postData[constants.CUSTOMER_PET_AGE]) ?
            dataObject.postData[constants.CUSTOMER_PET_AGE] : false;
         const pet_sex = validator.validateString(dataObject.postData[constants.CUSTOMER_PET_SEX]) ?
            dataObject.postData[constants.CUSTOMER_PET_SEX] : false;
         const weight = validator.validateString(dataObject.postData[constants.CUSTOMER_PET_WEIGHT]) ?
            dataObject.postData[constants.CUSTOMER_PET_WEIGHT] : false;
         if (customerId && jwToken && petType && petName && breed && pet_age && pet_sex && weight) {
            let serviceData = {};
            serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
            serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
            serviceData[constants.CORE_DATA] = dataObject.postData;
            serviceData[constants.CORE_TOKEN] = jwToken;
            serviceData[constants.CORE_TYPE] = constants.CORE_CUSTOMER_PET_DETAILS;
            const childWorker = childProcess.fork(`${__dirname}/../CoreServices/customer.js`);
            childWorker.send(serviceData);
            childWorker.on('message', childReply => {
               if (childReply[constants.CORE_ERROR_LEVEL]) {
                  resolve(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE), childReply[constants.CORE_ERROR_LEVEL]);
               } else {
                  reject(responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]));
               }
            });
         } else {
            reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1));
         }
      } else {
         reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
      }
   })
};
/**
 * Exporting the module.
 */
module.exports = customerHandler;
