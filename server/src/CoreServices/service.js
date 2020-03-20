const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const Service = require('./../Entity/service');
const serviceObj = {};
/**
 * Entry point to the core service. When a handler calls a core service process this method is called.
 * It validates the service authentication and then performs the request.
 */
process.on("message", (serviceData) => {
    const username = serviceData[constants.CORE_SERVICE_USER_NAME];
    const password = serviceData[constants.CORE_SERVICE_PASSWORD];
    if (username === process.env[constants.CORE_SERVICE_USER_NAME] && password === process.env[constants.CORE_SERVICE_PASSWORD]) {
        let promise;
        switch (serviceData[constants.CORE_TYPE]) {
            case constants.CORE_CREATE_SERVICE:
                promise = serviceObj.createService(serviceData[constants.CORE_DATA]);
                break;
            case constants.CORE_GET_SERVICE:
                promise = serviceObj.getService(serviceData[constants.CORE_DATA]);
                break;
            default:
                process.send(responseGenerator.generateCoreResponse(false, false, constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4));
                process.exit(1);
        }
        promise.then(response => {
            process.send(responseGenerator.generateCoreResponse(response[0], response[1]));
            process.exit(0);
        }).catch(err => {
            process.send(responseGenerator.generateCoreResponse(false, false, err[0], err[1]));
            process.exit(1);
        });
    } else {
        process.send(responseGenerator.generateCoreResponse(false, false,
            constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4));
        process.exit(1);
    }
});
/**
 * Method to create the service.
 * @param dataObject: The request object data.
 * @returns {Promise<Array>}:The response or the error along with the level.
 */
serviceObj.createService = (dataObject) => {
    return new Promise((resolve, reject) => {
        const service = new Service(false, dataObject[constants.SERVICE_NAME]);
        service.createService(dataObject[constants.EMPLOYEE_ID]).then(serviceId => {
            resolve([serviceId, constants.RESPONSE_SUCESS_LEVEL_1]);
        }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
        });
    });
};
/**
 * Method to get the service details.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}:The response or the error along with the level.
 */
serviceObj.getService = (dataObject) => {
    return new Promise((resolve, reject) => {
        const service = new Service(dataObject[constants.SERVICE_ID], dataObject[constants.SERVICE_NAME]);
        service.getServiceDetails().then(services => {
            resolve([services, constants.RESPONSE_SUCESS_LEVEL_1]);
        }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
        });
    });
};