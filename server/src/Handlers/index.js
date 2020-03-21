const constants = require('./../Helpers/constants');
const customer = require('./customer');
const vendor = require('./vendor');
const service = require('./service');
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
            case "customers":
                promise = customer.customer(dataObject);
                break;
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
 * Method to handle the vendor requests.
 * @param dataObject: The request obejct.
 * @returns {Promise<Array.>}
 */
handlerObj.vendor = (dataObject) => {
    return new Promise((resolve, reject) => {
        let promise;
        switch (dataObject.path) {
            case "vendors":
                promise = vendor.vendor(dataObject);
                break;
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
 * Method to handle the service requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response and the response code.
 */
handlerObj.service = (dataObject) => {
    return new Promise((resolve, reject) => {
        let promise;
        switch (dataObject.path) {
            case "services":
                promise = service.services(dataObject);
                break;
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