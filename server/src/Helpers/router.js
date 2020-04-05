const handlers = require('./../Handlers');
const validator = require('./validators');
const routes = {
   "customers": handlers.customers,
   "vendors": handlers.vendor,
   "services": handlers.service,
   "auth": handlers.auth,
   "subscription": handlers.subscription,
   "booking": handlers.booking
};

const path = {};
/**
 * Method to get the routed path.
 * @param requestPath: The Requested path.
 * @returns {boolean}: path if correct request else false.
 */
path.getPath = function (requestPath) {
   if (validator.validateUndefined(routes[requestPath])) {
      return routes[requestPath];
   }
   return handlers.notFound;
};
/**
 * Sending the path.
 */
module.exports = path;