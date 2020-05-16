const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
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
            promise = customerService.createCustomer(serviceData[constants.CORE_DATA]);
            break;
         case constants.CORE_CUSTOMER_GET:
            promise = customerService.getCustomerData(serviceData[constants.CORE_DATA]);
            break;
         case constants.CORE_CUSTOMER_SERVICE_ADD:
            break;
      }
      promise.then((data) => {
         process.send(responseGenerator.generateCoreResponse(data[0], data[1]));
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
 * Method to create the Customer.
 * @param dataObject: The customer data.
 * @returns {Promise<Array>} customerId if success, else ERROR.
 */
customerService.createCustomer = (dataObject) => {
   return new Promise((resolve, reject) => {
      const customer = new Customer(false, dataObject[constants.CUSTOMER_FIRST_NAME],
         dataObject[constants.CUSTOMER_LAST_NAME], dataObject[constants.CUSTOMER_EMAIL],
         dataObject[constants.CUSTOMER_PASSWORD], dataObject[constants.CUSTOMER_PHONE_NUMBER],
         dataObject[constants.CUSTOMER_GENDER], dataObject[constants.CUSTOMER_ADDRESS_1],
         dataObject[constants.CUSTOMER_ADDRESS_2], dataObject[constants.CUSTOMER_CITY],
         dataObject[constants.CUSTOMER_PINCODE]);
      customer.createCustomer(dataObject[constants.CUSTOMER_USED_REFERAL_CODE]).then(customerId => {
         resolve([customerId, constants.RESPONSE_SUCESS_LEVEL_1]);
      }).catch(err => {
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
      customer.getCustomerDetails().then(customerDetails => {
         resolve([customerDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
      }).catch(err => {
         reject([err, constants.ERROR_LEVEL_3]);
      });
   });
};

customerService.addCustomerService = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if(tokenGenerator.validateToken(jwToken)) {
         const customer = new Customer(dataObject[constants.CUSTOMER_ID]);
         customer.addCustomerService()
      }
   })
}
