const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const validator = require('./../Helpers/validators');
const tokenGenerator = require('./../Services/jwTokenGenerator');
const Payment = require('./../Entity/payment');
const paymentService = {};
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
         case constants.CORE_PAYMENT_CREATE:
            promise = paymentService.createPayment(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
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
 * Method to create the payment for a booking id.
 * @param dataObject: The required data.
 * @param jwToken: The token of the user.
 * @returns {Promise<unknown>}
 */
paymentService.createPayment = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      try {
         if (validator.validateUndefined(tokenGenerator.validateToken(jwToken))) {
            const payment = new Payment(dataObject[constants.BOOKING_ID], dataObject[constants.PAYMENT_TRANSACTION_ID],
               dataObject[constants.PAYMENT_AMOUNT]);
            payment.createPayment(dataObject[constants.CUSTOMER_ID]).then(result => {
               resolve([result, constants.RESPONSE_SUCESS_LEVEL_1]);
            }).catch(err => {
               printer.printError(err);
               reject([constants.ERROR_MESSAGE, constants.ERROR_LEVEL_3]);
            });
         } else {
            reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
         }
      } catch (e) {
         printer.printError(e);
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 *Exporting the module.
 */
module.exports = paymentService;