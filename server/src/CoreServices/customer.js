const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const Customer = require('./../Entity/customer');
const customerService = {};

const tokenGenerator = require('./../Services/jwTokenGenerator');
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
         case constants.CORE_CUSTOMER_ADDRESS_CREATE:
            promise = customerService.address(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_CUSTOMER_UPDATE:
            promise = customerService.updateDetails(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_CUSTOMER_PET_DETAILS:
            promise = customerService.addPetDetails(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         default:
            process.send(responseGenerator.generateCoreResponse(false, false, constants.INVALID_PATH, constants.ERROR_LEVEL_1));
            process.exit(1);
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
         dataObject[constants.CUSTOMER_GENDER]);
      customer.createCustomer(dataObject[constants.CUSTOMER_USED_REFERAL_CODE]).then(customerDetails => {
         resolve([customerDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
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
/**
 * Method to add the customer address.
 * @param dataObject: The required data.
 * @param jwToken: The token of the customer.
 * @returns {Promise<unknown>}
 */
customerService.address = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (tokenGenerator.validateToken(jwToken)) {
         const customer = new Customer(dataObject[constants.CUSTOMER_ID]);
         customer.addCustomerAddress(dataObject[constants.CUSTOMER_ADDRESS_1],
            dataObject[constants.CUSTOMER_ADDRESS_2], dataObject[constants.CUSTOMER_CITY],
            dataObject[constants.CUSTOMER_PINCODE],
            dataObject[constants.CUSTOMER_IS_DEFAULT_ADDRESS]).then(details => {
            resolve([details, constants.RESPONSE_SUCESS_LEVEL_1]);
         }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Method to update the customer details.
 * @param dataObject: the required data.
 * @param jwToken: The token of the customer.
 * @returns {Promise<Array>}
 */
customerService.updateDetails = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (tokenGenerator.validateToken(jwToken)) {
         const customer = new Customer(dataObject[constants.CUSTOMER_ID], false, false, false,
            dataObject[constants.CUSTOMER_PASSWORD], dataObject[constants.CUSTOMER_PHONE_NUMBER]);
         customer.updateCustomerDetails().then(details => {
            resolve([details, constants.RESPONSE_SUCESS_LEVEL_1]);
         }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Methodd to add the customer pet details.
 * @param dataObject: the required data.
 * @param jwToken: The token of the user.
 * @returns {Promise<unknown>}
 */
customerService.addPetDetails = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (tokenGenerator.validateToken(jwToken)) {
         const customer = new Customer(dataObject[constants.CUSTOMER_ID]);
         customer.addCustomerPetDetails(dataObject[constants.CUSTOMER_PET_TYPE],
            dataObject[constants.CUSTOMER_PET_NAME], dataObject[constants.CUSTOMER_PET_BREED],
            dataObject[constants.CUSTOMER_PET_AGE], dataObject[constants.CUSTOMER_PET_SEX],
            dataObject[constants.CUSTOMER_PET_WEIGHT]).then(result => {
            resolve([result, constants.RESPONSE_SUCESS_LEVEL_1])
         }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      }
   });
};