const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');

class Api {
    /**
     * _apiToken
     * _apiKey
     * @param apiToken
     * @param apiKey
     */
    constructor(apiToken, apiKey) {
        this._apiToken = validators.validateString(apiToken) ? apiToken : false;
        this._apiKey = validators.validateString(apiKey) ? apiKey : false;
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
}

/**
 * Exporting the module.
 * @type {Api}
 */
module.exports = Api;