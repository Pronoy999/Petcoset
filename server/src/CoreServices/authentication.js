const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const Authentication = require('./../Entity/authentication');
const authentication = {};
/**
 * Entry point to the core service. When a handler calls a core service process this method is called.
 * It validates the service authentication and then performs the request.
 */
process.on("message", (serviceData) => {
   const userName = serviceData[constants.CORE_SERVICE_USER_NAME];
   const password = serviceData[constants.CORE_SERVICE_PASSWORD];
   if (userName === process.env[constants.CORE_SERVICE_USER_NAME] && password === process.env[constants.CORE_SERVICE_PASSWORD]) {
      let promise;
      if (serviceData[constants.CORE_TYPE] === constants.CORE_AUTH_CHECK) {
         promise = authentication.checkAuthentication(serviceData[constants.CORE_DATA]);
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
 * Method to check the authentication.
 * @param dataObject: The service data.
 * @returns {Promise<unknown>}
 */
authentication.checkAuthentication = (dataObject) => {
   return new Promise((resolve, reject) => {
      const authentication = new Authentication(dataObject[constants.AUTH_EMAIL], dataObject[constants.AUTH_PASSWORD]);
      authentication.checkValidity().then(userData => {
         resolve([userData, constants.RESPONSE_SUCESS_LEVEL_1]);
      }).catch(err => {
         reject([err, constants.ERROR_LEVEL_3]);
      });
   });
};