const constants = require('./../Helpers/constants');
const handlerObj = {};
/**
 * Method to handle the ping requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response object with the Message and the HTTP Code.
 */
handlerObj.ping = (dataObject) => {
    return new Promise((resolve) => {
        resolve([constants.WELCOME_MESSAGE, constants.HTTP_SUCCESS]);
    });
};
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
handlerObj.customers = (dataObject) => {
    return new Promise((resolve, reject) => {
        //TODO:
    });
};
/**
 * Exporting the module.
 */
module.exports = handlerObj;