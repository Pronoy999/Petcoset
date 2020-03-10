const customerHandler = {};
const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const generator = require('./../Services/generator');
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
            const address1 = validator.validateString(dataObject.postData[constants.CUSTOMER_ADDRESS_1]) ?
                dataObject.postData[constants.CUSTOMER_ADDRESS_1] : false;
            const address2 = validator.validateString(dataObject.postData[constants.CUSTOMER_ADDRESS_2]) ?
                dataObject.postData[constants.CUSTOMER_ADDRESS_2] : false;
            const city = validator.validateNumber(dataObject.postData[constants.CUSTOMER_CITY]) ?
                dataObject.postData[constants.CUSTOMER_CITY] : false;
            const country = validator.validateNumber(dataObject.postData[constants.CUSTOMER_COUNTRY]) ?
                dataObject.postData[constants.CUSTOMER_COUNTRY] : false;
            const pincode = validator.validateNumber(dataObject.postData[constants.CUSTOMER_PINCODE]) ?
                dataObject.postData[constants.CUSTOMER_PINCODE] : false;
            const usedCode = validator.validateString(dataObject.postData[constants.CUSTOMER_USED_REFERAL_CODE]) ?
                dataObject.postData[constants.CUSTOMER_USED_REFERAL_CODE] : null;
            if (firstName && lastName && email && phoneNumber && gender && address1 && address2 && city && country && pincode) {
                const childWorker = childProcess.fork(`${__dirname}/../CoreServices/customer.js`);
                let serviceData = {};
                dataObject.postData[constants.CUSTOMER_USED_REFERAL_CODE] = usedCode;
                serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
                serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
                serviceData[constants.CORE_DATA] = dataObject.postData;
                serviceData[constants.CORE_TYPE] = constants.CORE_CUSTOMER_CREATE;
                childWorker.send(serviceData);
                childWorker.on("message", (childReply) => {
                    const requestKey = generator.generateRandomToken(16);
                    if (childReply[constants.CORE_ERROR]) {
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
                dataObject.queryString[constants.CUSTOMER_ID] : false;
            if (email || phoneNumber || id) {
                const childWorker = childProcess.fork(`${__dirname}/../CoreServices/customer.js`);
                let serviceData = {};
                serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
                serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
                serviceData[constants.CORE_TYPE] = constants.CORE_CUSTOMER_GET;
                serviceData[constants.CORE_DATA] = dataObject.queryString;
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
 * Exporting the mdoule.
 */
module.exports = customerHandler;