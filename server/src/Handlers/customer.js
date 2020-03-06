const customerHandler = {};
const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const childProcess = require('child_process');
const responseGenerator = require('./../Services/responseGenerator');
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
                dataObject.postData[constants.CUSTOMER_USED_REFERAL_CODE] : false;
            if (firstName && lastName && email && phoneNumber && gender && address1 && address2 && city && country && pincode) {
                const childWorker = childProcess.fork('./../CoreServices/customer.js');
                let serviceData = {};
                serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
                serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
                serviceData[constants.CORE_DATA] = dataObject.postData;
                serviceData[constants.CORE_TYPE] = constants.CORE_CUSTOMER_CREATE;
                childWorker.send(serviceData);
                childWorker.on("message", (childReply) => {
                    if (childReply[constants.CORE_ERROR]) {
                        responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, childReply[constants.CORE_ERROR_LEVEL]);
                    } else {
                        responseGenerator.generateResponse(childReply[constants.CORE_RESPONSE], childReply[constants.CORE_SUCCESS_LEVEL]);
                    }
                });
            } else {
                reject(responseGenerator.generateErrorResponse(constants.INSUFFICIENT_DATA_MESSAGE, constants.ERROR_LEVEL_1,
                    constants.INSUFFICIENT_DATA_MESSAGE));
            }
        } else {
            reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1,
                constants.INVALID_METHOD_MESSAGE));
        }
    });
};
/**
 * Exporting the mdoule. 
 */
module.exports = customerHandler;