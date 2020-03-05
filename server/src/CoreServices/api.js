const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const Api = require('./../Entity/api');
const apiService = {};
/**
 * Entry point to the core service. When a handler calls a core service process this method is called.
 * It validates the service authentication and then performs the request.
 */
process.on("message", (serviceData) => {
    const userName = serviceData[constants.CORE_SERVICE_USER_NAME];
    const password = serviceData[constants.CORE_SERVICE_PASSWORD];
    if (userName === process.env[constants.CORE_SERVICE_USER_NAME] && password === process.env[constants.CORE_SERVICE_PASSWORD]) {
        let promise;
        switch (serviceData[constants.CORE_TYPE]) {
            case constants.CORE_API_TOKEN_CHECK:
                console.log("Hello");
                promise = apiService.checkApiValidity(serviceData[constants.CORE_DATA]);
                break;
        }
        promise.then(() => {
            process.send(responseGenerator.generateCoreResponse(true, constants.RESPONSE_SUCESS_LEVEL_1));
            process.exit(0);
        }).catch(err => {
            process.send(responseGenerator.generateCoreResponse(false, false, true, constants.ERROR_LEVEL_4));
            process.exit(0);
        });
    } else {
        process.send(responseGenerator.generateCoreResponse(false, false,
            constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4));
        process.exit(1);
    }
});
/**
 * Method to check the validity of the API Token.
 * @param dataObject: The Core service data.
 * @returns {Promise<Boolean>} resolves if true, else false.
 */
apiService.checkApiValidity = (dataObject) => {
    return new Promise((resolve, reject) => {
        const api = new Api(dataObject[constants.API_TOKEN_KEY]);
        api.isValid().then(() => {
            resolve(true);
        }).catch(err => {
            printer.printError(err);
            reject(err);
        });
    });
};