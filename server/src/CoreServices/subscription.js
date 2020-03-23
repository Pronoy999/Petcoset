const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const tokenGenerator = require('./../Services/jwTokenGenerator');
const validator = require('./../Helpers/validators');
const subscriptionObj = {};
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
         case constants.CORE_SUBCRIPTION_CREATE://TODO:
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
 * Method to create subscription.
 * @param dataObject: The subscription data.
 * @param jwToken: The user token.
 * @returns {Promise<Array>}: The response object.
 */
subscriptionObj.createService = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (validator.validateUndefined(tokenGenerator.validateToken(jwToken))) {
         //TODO:Invoke the subscription method.
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Method to get the subscriptions.
 * @param dataObject: The filter data.
 * @param jwToken: The user token.
 * @returns {Promise<Array>}: The response object and the success level.
 */
subscriptionObj.getSubscription = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (validator.validateUndefined(tokenGenerator.validateToken(jwToken))) {
         //TODO: invoke subscription method.
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};