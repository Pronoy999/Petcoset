const constants = require('./../Helpers/constants');
const customer = require('./customer');
const responseGenerator = require('./../Services/responseGenerator');
const handlerObj = {};
/**
 * Method to handle the Error path requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response object with the Message and the HTTP Code.
 */
handlerObj.notFound = (dataObject) => {
    return new Promise((reject) => {
        reject([constants.INVALID_PATH, constants.HTTP_NOT_FOUND_CODE]);
    });
};
/**
 * Method to handle the customer requests. 
 */
handlerObj.customers = (dataObject) => {
    return new Promise((resolve, reject) => {
        let promise;
        switch (dataObject.path) {
            case "users": promise = customer.customer(dataObject); break;
            default:
                reject(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, constants.ERROR_LEVEL_2));
        }
        promise.then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
};
/**
 * Exporting the module.
 */
module.exports = handlerObj;