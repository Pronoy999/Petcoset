const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const Customer = require('./../Entity/customer');
const customerService = {};
process.on("message", (serviceData) => {
    const userName = serviceData[constants.CORE_SERVICE_USER_NAME];
    const password = serviceData[constants.CORE_SERVICE_PASSWORD];
    //TODO: Authenticate the service.
});
/**
 * Method to create the Customer.
 * @param dataObject: The customer data.
 * @returns {Promise<Any>} customerId if success, else ERROR.
 */
customerService.createCustomer = (dataObject) => {
    return new Promise((resolve, reject) => {
        const customer = new Customer(dataObject[constants.CUSTOMER_FIRST_NAME],
            dataObject[constants.CUSTOMER_LAST_NAME], dataObject[constants.CUSTOMER_EMAIL],
            dataObject[constants.CUSTOMER_PHONE_NUMBER], dataObject[constants.CUSTOMER_GENDER],
            dataObject[constants.CUSTOMER_ADDRESS_1], dataObject[constants.CUSTOMER_ADDRESS_2],
            dataObject[constants.CUSTOMER_CITY], dataObject[constants.CUSTOMER_STATE],
            dataObject[constants.CUSTOMER_COUNTRY], dataObject[constants.CUSTOMER_PINCODE]);
        customer.createCustomer(dataObject[constants.CUSTOMER_USED_REFERAL_CODE]).then(customerId => {
            resolve(customerId);
        }).catch(err => {
            printer.printError(err);
            reject(err);
        });
    });
};
