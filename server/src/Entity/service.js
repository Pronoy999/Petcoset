const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');

class Service {
   /**
    * _serviceId
    * _serviceName
    * _serviceType
    * @param serviceId
    * @param serviceName
    * @param serviceType
    */
   constructor(serviceId, serviceName, serviceType) {
      this._serviceId = validators.validateNumber(serviceId) ? serviceId : 0;
      this._serviceName = validators.validateString(serviceName) ? serviceName : false;
      this._serviceType = validators.validateString(serviceType) ? serviceType : false;
   }

   /**
    * Method to create a service.
    * @param empId: The Employee who is taking the action.
    * @returns {Promise<unknown>}
    */
   createService(empId) {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_SERVICE_REGISTRATION, [this._serviceName, this._serviceType, empId])
            .then(_resultSet => {
               const result = _resultSet[0][0];
               resolve(result);
            }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }

   /**
    * Method to get the service details.
    * You can either get the service by a service id or by a service name or all the services.
    * @returns {Promise<Array>}: The service details.
    */
   getServiceDetails() {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_SERVICE_SEARCH, [this._serviceName, this._serviceType, this._serviceId])
            .then(_resultSet => {
               const result = _resultSet[0];
               //If empty array is returned then blank array is returned.
               if (validators.validateUndefined(result)) {
                  resolve(result);
               } else {
                  resolve([]);
               }
            }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }
}

/**
 * Method to export the service module.
 * @type {Service}
 */
module.exports = Service;