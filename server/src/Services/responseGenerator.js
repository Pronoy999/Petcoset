const constants = require('./../Helpers/constants');
const response = {};
/**
 * * Method to generate the Error Response.
 * @param responseMessage: The Response Message.
 * @param errorLevel: the level of error.
 * @returns {[number, Object]}: The array containing the error code and the response object.
 *              The first index is the error code and the second is the error message.
 */
response.generateErrorResponse = (responseMessage, errorLevel) => {
    const res = {};
    let errorCode;
    res[constants.RESPONSE_KEY] = responseMessage;
    res[constants.ERROR_LEVEL_KEY] = errorLevel;
    switch (errorLevel) {
        case constants.ERROR_LEVEL_1:
            errorCode = constants.BAD_REQUEST_CODE;
            res[constants.RESPONSE_KEY_ERROR] = constants.BAD_REQUEST_MESSAGE;
            break;
        case constants.ERROR_LEVEL_2:
            errorCode = constants.HTTP_NOT_FOUND_CODE;
            res[constants.RESPONSE_KEY_ERROR] = constants.INVALID_PATH;
            break;
        case constants.ERROR_LEVEL_3:
            errorCode = constants.INTERNAL_SERVER_ERROR_CODE;
            res[constants.RESPONSE_KEY_ERROR] = constants.INTERNAL_SERVER_ERROR_MESSAGE;
            break;
        case constants.ERROR_LEVEL_4:
            errorCode = constants.FORBIDDEN_REQUEST_CODE;
            res[constants.RESPONSE_KEY_ERROR] = constants.FORBIDDEN_MESSAGE;
            break;
    }
    return ([errorCode, res]);
};
/**
 * Method to generate the response message.
 * @param responseMessage: The response message.
 * @param successLevel: the success level of the response.
 * @returns {[number, Object]}: The array containing the HTTP code and the
 *                          response object in 0 and 1 index respectively.
 */
response.generateResponse = (responseMessage, successLevel) => {
    const res = {};
    let httpCode;
    res[constants.RESPONSE_KEY] = responseMessage;
    switch (successLevel) {
        case constants.RESPONSE_SUCESS_LEVEL_1:
            httpCode = constants.HTTP_SUCCESS;
            break;
        case constants.RESPONSE_SUCCESS_LEVEL_2:
            httpCode = constants.HTTP_ACCEPTED_OKAY;
            break;
    }
    return ([httpCode, res]);
};
/**
 * Method to generate the Core Response.
 * @param message: The message to be send.
 * @param successLevel: The success level.
 * @param error: The error message.
 * @param errorLevel: The error level.
 */
response.generateCoreResponse = (message, successLevel, error, errorLevel) => {
    let res = {};
    if (error) {
        res[constants.CORE_RESPONSE] = false;
        res[constants.CORE_ERROR] = error;
        res[constants.CORE_ERROR_LEVEL] = errorLevel;
    } else {
        res[constants.CORE_RESPONSE] = message;
        res[constants.CORE_SUCCESS_LEVEL] = successLevel;
        res[constants.CORE_ERROR] = false;
    }
    return res;
};
/**
 * Exporting the module.
 */
module.exports = response;