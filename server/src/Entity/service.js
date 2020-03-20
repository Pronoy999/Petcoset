const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');

class Service {
    /**
     * _serviceId
     * _serviceName
     * @param serviceId
     * @param serviceName
     */
    constructor(serviceId, serviceName) {
        this._serviceId = validators.validateNumber(serviceId) ? serviceId : false;
        this._serviceName = validators.validateString(serviceName) ? serviceName : false;
    }

    /**
     * Method to create a service.
     * @param empId: The Employee who is taking the action.
     * @returns {Promise<unknown>}
     */
    createService(empId) {
        return new Promise((resolve, reject) => {
            //TODO: Create the Service.
        });
    }

    /**
     * Method to get the service details.
     * You can either get the service by a service id or by a service name or all the services.
     * @returns {Promise<Array>}: The service details.
     */
    getServiceDetails() {
        return new Promise((resolve, reject) => {
            //TODO: Get the service details.
        });
    }

    /**
     * Method to update the service name.
     * @returns {Promise<unknown>}
     */
    updateServiceName() {
        return new Promise((resolve, reject) => {
            //TODO: Update the service name.
        });
    }
}

/**
 * Method to export the service module.
 * @type {Service}
 */
module.exports = Service;