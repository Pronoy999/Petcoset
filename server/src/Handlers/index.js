const constants = require('./../Helpers/constants');
const customer = require('./customer');
const vendor = require('./vendor');
const service = require('./service');
const authentication = require('./authentication');
const subscription = require('./subscription');
const booking = require('./booking');
const city = require('./city');
const breed = require('./breed');
const responseGenerator = require('./../Services/responseGenerator');
const handlerObj = {};
/**
 * Method to handle the Error path requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response object with the Message and the HTTP Code.
 */
handlerObj.notFound = (dataObject) => {
   return new Promise((reject) => {
      reject([constants.INVALID_PATH, constants.HTTP_NOT_FOUND_CODE]);
   });
};
/**
 * Method to handle the customer requests.
 */
handlerObj.customers = (dataObject) => {
   return new Promise((resolve, reject) => {
      let promise;
      switch (dataObject.path) {
         case "customers":
            promise = customer.customer(dataObject);
            break;
         case "address":
            promise = customer.address(dataObject);
            break;
         case "service":
            promise = customer.customerService(dataObject);
            break;
         case "pet":
            promise = customer.petDetails(dataObject);
            break;
         default:
            reject(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, constants.ERROR_LEVEL_2));
      }
      promise.then(data => {
         resolve(data);
      }).catch(err => {
         reject(err);
      });
   });
};
/**
 * Method to handle the vendor requests.
 * @param dataObject: The request obejct.
 * @returns {Promise<Array.>}
 */
handlerObj.vendor = (dataObject) => {
   return new Promise((resolve, reject) => {
      let promise;
      switch (dataObject.path) {
         case "vendors":
            promise = vendor.vendor(dataObject);
            break;
         case "service":
            promise = vendor.vendorService(dataObject);
            break;
         case "2f":
            promise = vendor.twoFactor(dataObject);
            break;
         case "details":
            promise = vendor.details(dataObject);
            break;
         case "booking":
            promise = vendor.booking(dataObject);
            break;
         case "images":
            promise = vendor.images(dataObject);
            break;
         default:
            reject(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, constants.ERROR_LEVEL_2));
      }
      promise.then(data => {
         resolve(data);
      }).catch(err => {
         reject(err);
      });
   });
};
/**
 * Method to handle the service requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response and the response code.
 */
handlerObj.service = (dataObject) => {
   return new Promise((resolve, reject) => {
      let promise;
      switch (dataObject.path) {
         case "services":
            promise = service.services(dataObject);
            break;
         default:
            reject(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, constants.ERROR_LEVEL_2));
      }
      promise.then(data => {
         resolve(data);
      }).catch(err => {
         reject(err);
      });
   });
};
/**
 * Method to handle the authentication requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response object and the response code.
 */
handlerObj.auth = (dataObject) => {
   return new Promise((resolve, reject) => {
      let promise;
      switch (dataObject.path) {
         case "auth":
            promise = authentication.authenticate(dataObject);
            break;
         case "otp":
            promise = authentication.otp(dataObject);
            break;
         default:
            reject(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, constants.ERROR_LEVEL_2));
      }
      promise.then(data => {
         resolve(data);
      }).catch(err => {
         reject(err);
      });
   });
};
/**
 * Method to handle the subscription requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response object and the response code.
 */
handlerObj.subscription = (dataObject) => {
   return new Promise((resolve, reject) => {
      let promise;
      switch (dataObject.path) {
         case "subscription":
            promise = subscription.subscription(dataObject);
            break;
         case "search":
            promise = subscription.searchSubscription(dataObject);
            break;
         default:
            reject(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, constants.ERROR_LEVEL_2));
      }
      promise.then(data => {
         resolve(data);
      }).catch(err => {
         reject(err);
      });
   });
};
/**
 * Method to handle the booking request.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}: The response object and the response code.
 */
handlerObj.booking = (dataObject) => {
   return new Promise((resolve, reject) => {
      let promise;
      switch (dataObject.path) {
         case "booking":
            promise = booking.booking(dataObject);
            break;
         case "subscription":
            promise = booking.bookingSubscription(dataObject);
            break;
         case "service":
            promise = booking.bookingService(dataObject);
            break;
         default:
            reject(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, constants.ERROR_LEVEL_2));
      }
      promise.then(data => {
         resolve(data);
      }).catch(err => {
         reject(err);
      });
   });
};
/**
 * Method to handle the city requests.
 * @param dataObject: The request object.
 * @returns {Promise<unknown>}
 */
handlerObj.city = (dataObject) => {
   return new Promise((resolve, reject) => {
      let promise;
      switch (dataObject.path) {
         case "city":
            promise = city.city(dataObject);
            break;
         case "state":
            promise = city.state(dataObject);
            break;
         default:
            reject(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, constants.ERROR_LEVEL_2));
      }
      promise.then(data => {
         resolve(data);
      }).catch(err => {
         reject(err);
      });
   });
};
/**
 * Method to handle the breed requests.
 * @param dataObject: The request object.
 * @returns {Promise<Array>}
 */
handlerObj.breed = (dataObject) => {
   return new Promise((resolve, reject) => {
      let promise;
      switch (dataObject.path) {
         case "breed":
            promise = breed.breed(dataObject);
            break;
         default:
            reject(responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, constants.ERROR_LEVEL_2));
      }
      promise.then(data => {
         resolve(data);
      }).catch(err => {
         reject(err);
      });
   });
};
/**
 * Exporting the module.
 */
module.exports = handlerObj;
