const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const Service = require('./../Entity/service');
const tokenGenerator = require('./../Services/jwTokenGenerator');
const validator = require('./../Helpers/validators');
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
            promise = serviceObj.createService(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_GET_SERVICE:
            promise = serviceObj.getService(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_SERVICE_SEARCH_VENDORS:
            promise = serviceObj.searchVendors(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
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
 * @param jwToken: The JwToken of the user taking the action.
 * @returns {Promise<Array>}:The response or the error along with the level.
 */
serviceObj.createService = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      const tokenData = tokenGenerator.validateToken(jwToken);
      if (validator.validateUndefined(tokenData)) {
         const service = new Service(false, dataObject[constants.SERVICE_NAME], dataObject[constants.SERVICE_TYPE]);
         service.createService(dataObject[constants.EMPLOYEE_ID]).then(serviceId => {
            resolve([serviceId, constants.RESPONSE_SUCESS_LEVEL_1]);
         }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Method to get the service details.
 * @param dataObject: The request object.
 * @param jwToken: The JwToken of the user.
 * @returns {Promise<Array>}:The response or the error along with the level.
 */
serviceObj.getService = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (validator.validateUndefined(tokenGenerator.validateToken(jwToken))) {
         const service = new Service(dataObject[constants.SERVICE_ID], dataObject[constants.SERVICE_NAME]);
         service.getServiceDetails().then(services => {
            resolve([services, constants.RESPONSE_SUCESS_LEVEL_1]);
         }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Method to get the vendor for a service.
 * @param dataObject: The required data.
 * @param jwToken: The token of the user.
 * @returns {Promise<Array>}:
 */
serviceObj.searchVendors = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (tokenGenerator.validateToken(jwToken)) {
         const service = new Service(dataObject[constants.SERVICE_ID]);
         service.getVendors(dataObject[constants.BOOKING_DATE], dataObject[constants.BOOKING_TIME]).then(vendorDetails => {
            resolve([vendorDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
         }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};