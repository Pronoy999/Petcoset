const printer = require('./../Helpers/printer');
const validators = require('./../Helpers/validators');
const queryGenerator = {};
/**
 * Method to generate the SP Query.
 * @param spName: The name of the SP to be invoked.
 * @param params: The array containing the params.
 * @returns {boolean|string}: The String query to be executed.
 */
queryGenerator.generateSPQuery = (spName, params) => {
    if (validators.validateString(spName)) {
        let query = "CALL " + spName;
        if (params.length > 0) {
            params = params.filter((data) => {
                return data !== undefined;
            });
            query += "(";
            query += (params.map(par => _joinData(par)).join(","));
            return query += ")";
        } else {
            return query;
        }
    } else {
        printer.printError("Invalid SP Name.");
        return false;
    }
};

/**
 * Internal method to join the data for the SP parameters.
 * @param {String} data : The Data to be joined.
 */
function _joinData(data) {
    if (validators.validateString(data)) {
        return "'" + data + "'";
    } else if (validators.validateNumber(data)) {
        return data;
    }
    return "''";
}

/**
 * Exporting the module.
 */
module.exports = queryGenerator;