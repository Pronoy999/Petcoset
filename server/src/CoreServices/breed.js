const constants = require('./../Helpers/constants');
const responseGenerator = require('./../Services/responseGenerator');
const Breed = require('./../Entity/breed');
const breedService = {};
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
         case constants.CORE_BREED_SEARCH:
            promise = breedService.getBreedDetails(serviceData[constants.CORE_DATA]);
            break;
      }
      promise.then(data => {
         process.send(responseGenerator.generateCoreResponse(data[0], data[1], false, false));
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
 * Method to handle the breed requests.
 * @param dataObject: The required data.
 * @returns {Promise<Array>}: the response object and the success or error level.
 */
breedService.getBreedDetails = (dataObject) => {
   return new Promise((resolve, reject) => {
      const breed = new Breed(false, dataObject[constants.BREED_PET_TYPE]);
      breed.getBreedDetails().then(breedDetails => {
         resolve([breedDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
      }).catch(err => {
         reject([err, constants.ERROR_LEVEL_3]);
      });
   });
};