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
         case constants.CORE_CUSTOMER_PET_DETAILS:
            promise = customerService.addPetDetails(serviceData[constants.CORE_DATA]);
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
         customer.createCustomerService(dataObject[constants.SERVICE_ID], dataObject[constants.CUSTOMER_PREFERRED_LOACTION],
             dataObject[constants.CUSTOMER_START_DATE], dataObject[constants.CUSTOMER_END_DATE],
             dataObject[constants.CUSTOMER_DROP_OFF_TIME], dataObject[constants.CUSTOMER_PICK_UP_TIME],
             dataObject[constants.CUSTOMER_PET_NAME], dataObject[constants.CUSTOMER_PET_TYPE],
             dataObject[constants.CUSTOMER_PET_SEX], dataObject[constants.CUSTOMER_PET_BREED],
             dataObject[constants.CUSTOMER_PET_AGE], dataObject[constants.CUSTOMER_PET_WEIGHT],
             dataObject[constants.CUSTOMER_HAS_HOUSE], dataObject[constants.CUSTOMER_HAS_FENCED_GARDEN],
             dataObject[constants.CUSTOMER_IS_PETS_ALLOWED_FURNITURE], dataObject[constants.CUSTOMER_IS_ALLOWED_ON_BED],
             dataObject[constants.CUSTOMER_IS_NON_SMOKING_HOME], dataObject[constants.CUSTOMER_IS_OWN_CAT],
             dataObject[constants.CUSTOMER_IS_OWN_DOG], dataObject[constants.CUSTOMER_IS_ONE_BOOKING_AT_A_TIME],
             dataObject[constants.CUSTOMER_IS_CAGED_PET], dataObject[constants.CUSTOMEER_CHILD_AGE],
             dataObject[constants.CUSTOMER_BATH_NAIL_CLIPPING], dataObject[constants.CUSTOMER_FIRST_AID_CERTFIED],
             dataObject[constants.CUSTOMER_NEED_OFTEN], dataObject[constants.CUSTOMER_NO_OF_VISIT],
             dataObject[constants.CUSTOMER_MATE_PET], dataObject[constants.CUSTOMER_AVAILABLE_MATING],
             dataObject[constants.CUSTOMER_VISIT_TYPE], dataObject[constants.CUSTOMER_PET_ADOPTION],
             dataObject[constants.CUSTOMER_ENLIST_ADOPTION], dataObject[constants.CUSTOMER_TRAINING_CATEGORY])
               .then(result => {
               resolve([result, constants.RESPONSE_SUCESS_LEVEL_1])
             }).catch(err => {
               reject([err, constants.ERROR_LEVEL_3])
            });
      }
   })
}

customerService.addPetDetails = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if(tokenGenerator.validateToken(jwToken)) {
         const customer = new Customer(dataObject[constants.CUSTOMER_ID]);
         customer.AddCustomerPetDetails(dataObject[constants.CUSTOMER_ID], dataObject[constants.CUSTOMER_PET_TYPE],
          dataObject[constants.CUSTOMER_PET_NAME], dataObject[constants.CUSTOMER_PET_BREED],
          dataObject[constants.CUSTOMER_PET_AGE], dataObject[constants.CUSTOMER_PET_SEX],
          dataObject[constants.CUSTOMER_PET_WEIGHT]).then(result =>{
             resolve([result,constants.RESPONSE_SUCESS_LEVEL_1])
         }).catch(err => {
             reject([err, constants.ERROR_LEVEL_3]);
         });
      }
   });
}
