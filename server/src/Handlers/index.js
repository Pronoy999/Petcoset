const constants = require('./../Helpers/constants');
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
handlerObj.customers = (dataObject) => {
    return new Promise((resolve, reject) => {
        let promise;
        switch(dataObject.path){
            //TODO:
        }
    });
};
/**
 * Exporting the module.
 */
module.exports = handlerObj;