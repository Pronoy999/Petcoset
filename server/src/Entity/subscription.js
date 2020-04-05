const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');

class Subscription {
    /**
     * _subscriptionID
     * _subscriptionName
     * _subscriptionAmount
     * _startDate
     * _endDate
     * @param subscriptionId
     * @param subscriptionName
     * @param subscriptionAmount
     * @param startDate
     * @param endDate
     */
    constructor(subscriptionId, subscriptionName, subscriptionAmount, startDate, endDate) {
        this._subscriptionID = validators.validateNumber(subscriptionId) ? subscriptionId : false;
        this._subscriptionName = validators.validateString(subscriptionName) ? subscriptionName : false;
        this._subscriptionAmount = validators.validateNumber(subscriptionAmount) ? subscriptionAmount : false;
        this._startDate = validators.validateDate(startDate) ? startDate : false;
        this._endDate = validators.validateDate(endDate) ? endDate : false;
    }

    /**
     * Method to create the subscription.
     * @param serviceDetails: the array containing the service ids and the count.
     * @param empId: The employee taking the action.
     * @returns {Promise<Object>}: the id of the subscription created, else -1.
     */
    createSubscription(serviceDetails, empId) {
        return new Promise((resolve, reject) => {
            let serviceIds = [];
            let serviceCount = [];
            serviceDetails.forEach(oneService => {
                serviceIds.push(Object.keys(oneService)[0]);
                serviceCount.push(oneService[Object.keys(oneService)[0]]);
            });
            database.runSp(constants.SP_SUBSCRIPTION_REGISTRATION, [empId, this._subscriptionName,
                this._subscriptionAmount, serviceIds.join(","), serviceCount.join(","), this._startDate, this._endDate])
               .then(_resultSet => {
                   const result = _resultSet[0][0];
                   if (validators.validateUndefined(result)) {
                       resolve(result);
                   } else {
                       resolve({"id": -1});
                   }
               }).catch(err => {
                printer.printError(err);
                reject(err);
            });
        });
    }

    /**
     * Method to search for Subscription based on the filters.
     * @param serviceDetails: The list of the services that are included in the subscription.
     * @param priceStart: The range of price start.
     * @param priceEnd: The range of Price end.
     * @returns {Promise<Array>}: The array of subscriptions that match the criteria.
     */
    getSubscription(serviceDetails, priceStart, priceEnd) {
        return new Promise((resolve, reject) => {
            let serviceList;
            serviceList = validators.validateUndefined(serviceDetails) ? serviceDetails.join(",") : "";
            serviceList = validators.validateUndefined(serviceList) ? serviceList : "";
            let validity = generator.generateDateDifference(this._startDate, this._endDate);
            validity = validators.validateNumber(validity) ? validity : 0;
            priceStart = validators.validateNumber(priceStart) ? priceStart : 0;
            priceEnd = validators.validateNumber(priceEnd) ? priceEnd : 0;
            database.runSp(constants.SP_SUBSCRIPTION_SEARCH, [priceStart, priceEnd, serviceList, this._subscriptionName, validity])
               .then(_resultSet => {
                   const result = _resultSet[0];
                   if (validators.validateUndefined(result)) {
                       resolve(result);
                   } else {
                       resolve({"id": -1});
                   }
               }).catch(err => {
                printer.printError(err);
                reject(err);
            });
        });
    }
}

/**
 * Exporting the subscription module.
 * @type {Subscription}
 */
module.exports = Subscription;