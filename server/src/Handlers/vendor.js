const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const childProcess = require('child_process');
const vendorHandler = {};
vendorHandler.vendor = (dataObject) => {
    return new Promise((resolve, reject) => {
        const method = dataObject.method;
        if (method === constants.HTTP_POST) {
            const firstName = validator.validateString(dataObject.postData[constants.VENDOR_FIRST_NAME]) ?
                dataObject.postData[constants.VENDOR_FIRST_NAME] : false;
            const lastName = validator.validateString(dataObject.postData[constants.VENDOR_LAST_NAME]) ?
                dataObject.postData[constants.VENDOR_LAST_NAME] : false;

        } else {
            reject(responseGenerator.generateErrorResponse(constants.INVALID_METHOD_MESSAGE, constants.ERROR_LEVEL_1));
        }
    });
};
/**
 * Exporting the vendor module.
 */
module.exports = vendorHandler;
