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
            const address1 = validator.validateString(dataObject.postData[constants.VENDOR_ADDRESS_1]) ?
                dataObject.postData[constants.VENDOR_ADDRESS_1] : false;
            const address2 = validator.validateString(dataObject.postData[constants.VENDOR_ADDRESS_2]) ?
                dataObject.postData[constants.VENDOR_ADDRESS_2] : false;
            const pincode = validator.validateNumber(dataObject.postData[constants.VENDOR_PINCODE]) ?
                dataObject.postData[constants.VENDOR_PINCODE] : false;
            const city = validator.validateNumber(dataObject.postData[constants.VENDOR_CITY]) ?
                dataObject.postData[constants.VENDOR_CITY] : false;
            const documentIdentificationNumber = validator.validateUndefined(dataObject.postData[constants.DOCUMENT_ID_NUMBER]) ?
                dataObject.postData[constants.DOCUMENT_ID_NUMBER] : false;
            const documentType = validator.validateString(dataObject.postData[constants.DOCUMENT_TYPE]) ?
                dataObject.postData[constants.DOCUMENT_TYPE] : false;
            if (firstName && lastName && email && gender && phoneNumber && address1 && address2 && pincode && city && documentIdentificationNumber && documentType) {
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
        } else {
            reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
        }
    });
};
/**
 * Exporting the vendor module.
 */
module.exports = vendorHandler;
