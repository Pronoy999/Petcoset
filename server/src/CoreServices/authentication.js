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
      } else if (serviceData[constants.CORE_TYPE] === constants.CORE_AUTH_OTP_REQEUST) {
         promise = authentication.requestOTP(serviceData[constants.CORE_DATA]);
      } else if (serviceData[constants.CORE_TYPE] === constants.CORE_AUTH_OTP_VALIDATE) {
         promise = authentication.verifyOTP(serviceData[constants.CORE_DATA]);
      } else if (serviceData[constants.CORE_TYPE] === constants.CORE_AUTH_REQUEST_PASSWORD_TOKEN) {
         promise = authentication.requestPasswordToken(serviceData[constants.CORE_DATA]);
      } else if (serviceData[constants.CORE_TYPE] === constants.CORE_AUTH_PASSWORD_FORGET) {
         promise = authentication.changePassword(serviceData[constants.CORE_DATA]);
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
/**
 * Method to handle the OTP request.
 * @param dataObject: The required data.
 * @returns {Promise<unknown>}
 */
authentication.requestOTP = (dataObject) => {
   return new Promise((resolve, reject) => {
      const authentication = new Authentication();
      authentication.requestOtp(dataObject[constants.CUSTOMER_PHONE_NUMBER]).then(() => {
         resolve([true, constants.RESPONSE_SUCESS_LEVEL_1]);
      }).catch(err => {
         reject([err, constants.ERROR_LEVEL_3]);
      });
   });
};
/**
 * Method to handle the OTP verification.
 * @param dataObject
 * @returns {Promise<unknown>}
 */
authentication.verifyOTP = (dataObject) => {
   return new Promise((resolve, reject) => {
      const authentication = new Authentication();
      authentication.verifyOtp(dataObject[constants.CUSTOMER_PHONE_NUMBER], dataObject[constants.OTP]).then((isValid) => {
         resolve([isValid, constants.RESPONSE_SUCESS_LEVEL_1]);
      }).catch(err => {
         reject([err, constants.ERROR_LEVEL_3]);
      });
   });
};
/**
 * Method to request the password change token.
 * @param dataObject: the required object.
 * @returns {Promise<unknown>}
 */
authentication.requestPasswordToken = (dataObject) => {
   return new Promise((resolve, reject) => {
      const authentication = new Authentication(dataObject[constants.AUTH_EMAIL]);
      authentication.requestPasswordChangeToken(dataObject[constants.IS_PRODUCTION]).then(result => {
         resolve([result, constants.RESPONSE_SUCESS_LEVEL_1]);
      }).catch(err => {
         reject([err, constants.ERROR_LEVEL_3]);
      });
   });
};
/**
 * Method to change the password with valid token.
 * @param dataObject: the required object.
 * @returns {Promise<unknown>}
 */
authentication.changePassword = (dataObject) => {
   return new Promise((resolve, reject) => {
      const authentication = new Authentication(dataObject[constants.AUTH_EMAIL], dataObject[constants.AUTH_PASSWORD]);
      authentication.validateTokenAndChangePassword(dataObject[constants.AUTH_PASSWORD_TOKEN]).then(result => {
         resolve([result, constants.RESPONSE_SUCESS_LEVEL_1]);
      }).catch(err => {
         reject([err, constants.ERROR_LEVEL_3]);
      });
   });
};