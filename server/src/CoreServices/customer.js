const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const Customer = require('./../Entity/customer');
const customerService = {};
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
            case constants.CORE_CUSTOMER_CREATE:
                promise = customerService.createCustomer(serviceData[constants.CORE_DATA]); break;
            //case constants.CORE_CUSTOMER_GET:
        }
        promise.then((data) => {
            process.send(_generateCoreResponse(data[0], data[1]));
            process.exit(0);
        }).catch(err => {
            process.send(_generateCoreResponse(false, false, err[0], err[1]));
            process.exit(1);
        });
    } else {
        process.send(_generateCoreResponse(false, false, constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4));
        process.exit(1);
    }
});
/**
 * Method to create the Customer.
 * @param dataObject: The customer data.
 * @returns {Promise<Any>} customerId if success, else ERROR.
 */
customerService.createCustomer = (dataObject) => {
    return new Promise((resolve, reject) => {
        const customer = new Customer(false, dataObject[constants.CUSTOMER_FIRST_NAME],
            dataObject[constants.CUSTOMER_LAST_NAME], dataObject[constants.CUSTOMER_EMAIL],
            dataObject[constants.CUSTOMER_PHONE_NUMBER], dataObject[constants.CUSTOMER_GENDER],
            dataObject[constants.CUSTOMER_ADDRESS_1], dataObject[constants.CUSTOMER_ADDRESS_2],
            dataObject[constants.CUSTOMER_CITY], dataObject[constants.CUSTOMER_STATE],
            dataObject[constants.CUSTOMER_COUNTRY], dataObject[constants.CUSTOMER_PINCODE]);
        customer.createCustomer(dataObject[constants.CUSTOMER_USED_REFERAL_CODE]).then(customerId => {
            resolve([customerId, constants.RESPONSE_SUCESS_LEVEL_1]);
        }).catch(err => {
            printer.printError(err);
            reject([err, constants.ERROR_LEVEL_3]);
        });
    });
};
/**
 * Method to get the customer data. 
 */
customerService.getCustomerData = (dataObject) => {
    return new Promise((resolve, reject) => {
        const customerId = dataObject[constants.CUSTOMER_ID];
        const customerEmail = dataObject[constants.CUSTOMER_EMAIL];
        const customerPhone = dataObject[constants.CUSTOMER_PHONE_NUMBER];
        const customer = new Customer(customerId, false, false, customerEmail, customerPhone);
        //TODO: Get the customer details.
    });
};
/**
 * Method to generate the core service response object. 
 * @param {String | Object} message : the response object or data.
 * @param {ERROR} error : The error message. 
 */
function _generateCoreResponse(message, successLevel, error, errorLevel) {
    let res = {};
    if (err) {
        res[constants.CORE_RESPONSE] = false;
        res[constants.CORE_ERROR] = error;
        res[constants.CORE_ERROR_LEVEL] = errorLevel;
    } else {
        res[constants.CORE_RESPONSE] = message;
        res[constants.CORE_SUCCESS_LEVEL] = successLevel;
        res[constants.CORE_ERROR] = false;
    }
    return res;
}