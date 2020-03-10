const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');

class Api {
    /**
     * _apiToken
     * _apiKey
     * _requestKey
     * @param apiToken
     * @param apiKey
     * @param requestKey
     */
    constructor(apiToken, apiKey, requestKey) {
        this._apiToken = validators.validateString(apiToken) ? apiToken : false;
        this._apiKey = validators.validateString(apiKey) ? apiKey : false;
        this._requestKey = validators.validateString(requestKey) ? requestKey : false;
    }

    /**
     * Method to check whether the API Token is valid or not.
     * @returns {Promise<unknown>}
     */
    isValid() {
        return new Promise((resolve, reject) => {
            database.runSp(constants.SP_CHECK_API_TOKEN, [this._apiToken]).then(_resultSet => {
                const result = _resultSet[0][0];
                if (result[constants.IS_VALID] === 1) {
                    resolve(true);
                } else {
                    reject(false);
                }
            }).catch(err => {
                printer.printError(err);
                reject(err);
            });
        });
    }

    /**
     * Method to log the API Status.
     * @param path: The end point.
     * @param responseCode: The HTTP response Code that was send.
     * @param apiStatus: The API Status.
     * @returns {Promise<Boolean>}: true, if successfully logged, else false.
     */
    logApiStatus(path, responseCode, apiStatus) {
        return new Promise((resolve, reject) => {
            database.runSp(constants.SP_LOG_API_STATUS, [this._requestKey, path, apiStatus, responseCode, this._apiKey])
                .then(_resultSet => {
                    printer.printHighlightedLog("API Status Logged: " + _resultSet);
                    resolve(true);
                }).catch(err => {
                printer.printError(err);
                reject(err);
            });
        });
    }
}

/**
 * Exporting the module.
 * @type {Api}
 */
module.exports = Api;