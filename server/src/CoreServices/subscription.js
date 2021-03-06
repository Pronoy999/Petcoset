const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const tokenGenerator = require('./../Services/jwTokenGenerator');
const validator = require('./../Helpers/validators');
const Subscription = require('./../Entity/subscription');
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
         case constants.CORE_SUBCRIPTION_CREATE:
            promise = subscriptionObj.createSubscription(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_SUBCRIPTION_SEARCH:
            promise = subscriptionObj.getSubscription(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
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
 * Method to create subscription.
 * @param dataObject: The subscription data.
 * @param jwToken: The user token.
 * @returns {Promise<Array>}: The response object.
 */
subscriptionObj.createSubscription = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (validator.validateUndefined(tokenGenerator.validateToken(jwToken))) {
         const subscription = new Subscription(false, dataObject[constants.SUBSCRIPTION_NAME],
            dataObject[constants.SUBSCRIPTION_AMOUNT], dataObject[constants.SUBSCRIPTION_START_DATE],
            dataObject[constants.SUBSCRIPTION_END_DATE]);
         subscription.createSubscription(dataObject[constants.SUBSCRIPTION_SERVICE_DETAILS], dataObject[constants.EMPLOYEE_ID])
            .then(subscriptionId => {
               resolve([subscriptionId, constants.RESPONSE_SUCESS_LEVEL_1]);
            }).catch(err => {
            reject([constants.ERROR_MESSAGE, constants.ERROR_LEVEL_3]);
         });
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
         const subscription = new Subscription(false, dataObject[constants.SUBSCRIPTION_NAME], false,
            dataObject[constants.SUBSCRIPTION_START_DATE], dataObject[constants.SUBSCRIPTION_END_DATE]);
         subscription.getSubscription(dataObject[constants.SUBSCRIPTION_SERVICE_DETAILS], dataObject[constants.SUBSCRIPTION_PRICE_START],
            dataObject[constants.SUBSCRIPTION_PRICE_END]).then(subscriptions => {
            resolve([subscriptions, constants.RESPONSE_SUCESS_LEVEL_1]);
         }).catch(err => {
            reject([constants.ERROR_MESSAGE, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};