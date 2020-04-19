const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const responseGenerator = require('./../Services/responseGenerator');
const City = require('./../Entity/city');
const cityHandler = {};
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
         case constants.CORE_CITY_SEARCH:
            promise = cityHandler.searchCity(serviceData[constants.CORE_DATA]);
            break;
         case constants.CORE_STATE_SEARCH:
            promise = cityHandler.searchState(serviceData[constants.CORE_DATA]);
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
 * Method to handle the city search requests.
 * @param dataObject: The required data.
 * @returns {Promise<Array>}: The response object and the success or error level.
 */
cityHandler.searchCity = (dataObject) => {
   return new Promise((resolve, reject) => {
      const city = new City(false, dataObject[constants.CITY_NAME]);
      city.searchCityName(dataObject[constants.CITY_STATE_ID]).then(cityDetails => {
         resolve([cityDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
      }).catch(err => {
         reject([err, constants.ERROR_LEVEL_3]);
      });
   });
};
/**
 * Method to handle the state search.
 * @param dataObject: The required data.
 * @returns {Promise<unknown>}
 */
cityHandler.searchState = (dataObject) => {
   return new Promise((resolve, reject) => {
      const city = new City();
      city.searchState().then(cityDetails => {
         resolve([cityDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
      }).catch(err => {
         reject([err, constants.ERROR_LEVEL_3]);
      });
   });
};