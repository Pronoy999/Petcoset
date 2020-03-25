const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const childProcess = require('child_process');
const subscriptionHandler = {};
/**
 * Method to handle the subscription request.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: the Response object and the response code.
 */
subscriptionHandler.subscription = (dataObject) => {
    return new Promise((resolve, reject) => {
        const method = dataObject.method;
        if (method === constants.HTTP_POST) {
            const subscriptionName = validator.validateString(dataObject.postData[constants.SUBSCRIPTION_NAME]) ?
                dataObject.postData[constants.SUBSCRIPTION_NAME] : false;
            const subscriptionAmount = validator.validateNumber(dataObject.postData[constants.SUBSCRIPTION_AMOUNT]) ?
                dataObject.postData[constants.SUBSCRIPTION_AMOUNT] : false;
            const startDate = validator.validateDate(dataObject.postData[constants.SUBSCRIPTION_START_DATE]) ?
                dataObject.postData[constants.SUBSCRIPTION_START_DATE] : false;
            const endDate = validator.validateDate(dataObject.postData[constants.SUBSCRIPTION_END_DATE]) ?
                dataObject.postData[constants.SUBSCRIPTION_END_DATE] : false;
            const subscriptionService = validator.validateUndefined(dataObject.postData[constants.SUBSCRIPTION_SERVICE_DETAILS]) ?
                dataObject.postData[constants.SUBSCRIPTION_SERVICE_DETAILS] : false;
            const empId = validator.validateNumber(dataObject.postData[constants.EMPLOYEE_ID]) ?
                dataObject.postData[constants.EMPLOYEE_ID] : false;
            if (subscriptionName && subscriptionAmount && startDate && endDate && subscriptionService && empId) {
                let serviceData = {};
                serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
                serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
                serviceData[constants.CORE_DATA] = dataObject.postData;
                serviceData[constants.CORE_TOKEN] = dataObject[constants.JW_TOKEN];
                serviceData[constants.CORE_TYPE] = constants.CORE_SUBCRIPTION_CREATE;
                const childWorker = childProcess.fork(`${__dirname}/../CoreServices/subscription.js`);
                childWorker.send(serviceData);
                childWorker.on("message", childReply => {
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
 * Method to handle the subscription search.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response code and the response object.
 */
subscriptionHandler.searchSubscription = (dataObject) => {
    return new Promise((resolve, reject) => {
        const method = dataObject.method;
        if (method === constants.HTTP_POST) {
            const subscriptionName = validator.validateString(dataObject.postData[constants.SUBSCRIPTION_NAME]) ?
                dataObject.postData[constants.SUBSCRIPTION_NAME] : false;
            const priceStart = validator.validateNumber(dataObject.postData[constants.SUBSCRIPTION_PRICE_START]) ?
                dataObject.postData[constants.SUBSCRIPTION_PRICE_START] : false;
            const priceEnd = validator.validateNumber(dataObject.postData[constants.SUBSCRIPTION_PRICE_END]) ?
                dataObject.postData[constants.SUBSCRIPTION_PRICE_END] : false;
            const serviceDetails = validator.validateUndefined(dataObject.postData[constants.SUBSCRIPTION_SERVICE_DETAILS]) ?
                dataObject.postData[constants.SUBSCRIPTION_SERVICE_DETAILS] : false;
            const startDate = validator.validateDate(dataObject.postData[constants.SUBSCRIPTION_START_DATE]) ?
                dataObject.postData[constants.SUBSCRIPTION_START_DATE] : false;
            const endDate = validator.validateDate(dataObject.postData[constants.SUBSCRIPTION_END_DATE]) ?
                dataObject.postData[constants.SUBSCRIPTION_END_DATE] : false;
            const jwToken = validator.validateString(dataObject[constants.JW_TOKEN]) ? dataObject[constants.JW_TOKEN] : false;
            if ((subscriptionName || (priceStart && priceEnd) || serviceDetails || (startDate && endDate)) && jwToken) {
                let serviceData = {};
                serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
                serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
                serviceData[constants.CORE_DATA] = dataObject.postData;
                serviceData[constants.CORE_TOKEN] = jwToken;
                serviceData[constants.CORE_TYPE] = constants.CORE_SUBCRIPTION_SEARCH;
                const childWorker = childProcess.fork(`${__dirname}/../CoreServices/subscription.js`);
                childWorker.send(serviceData);
                childWorker.on("message", childReply => {
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
 * Exporting the subscription handler.
 * @type {{}}
 */
module.exports = subscriptionHandler;