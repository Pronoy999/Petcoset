const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');

class Customer {
    /**
     * _firstName
     * _lastName
     * _email
     * _phone
     * _gender
     * _address1
     * _address2
     * _city
     * _state
     * _country
     * _pincode
     */
    constructor(id, firstName, lastName, email, phone, gender, address1, address2, city, state, country, pincode) {
        this._id = validators.validateNumber(id) ? id : false;
        this._firstName = validators.validateString(firstName) ? firstName : false;
        this._lastName = validators.validateString(lastName) ? lastName : false;
        this._email = validators.validateEmail(email) ? email : false;
        this._phone = validators.validatePhone(phone) ? phone : false;
        this._gender = validators.validateCharacter(gender) ? gender : false;
        this._address1 = validators.validateString(address1) ? address1 : false;
        this._address2 = validators.validateString(address2) ? address2 : false;
        this._city = validators.validateNumber(city) ? city : false;
        this._state = validators.validateNumber(state) ? state : false;
        this._country = validators.validateNumber(country) ? country : false;
        this._pincode = validators.validateNumber(pincode) ? pincode : false;
    }

    /**
     * Method to create the customer.
     * @param {String} usedReferralCode
     */
    createCustomer(usedReferralCode) {
        return new Promise((resolve, reject) => {
            this._ownReferalCode = generator.generateRandomToken(6);
            database.runSp(constants.SP_CREATE_CUSTOMER, [this._firstName, this._lastName, this._email,
                this._phone, this._gender, this._address1, this._address2, this._city, this._state, this._country, this._pincode,
                this._ownReferalCode, usedReferralCode]).then(_resultSet => {
                printer.printHighlightedLog(_resultSet);
                const result = _resultSet[0][0];
                this._id = result[constants.CUSTOMER_ID];
                resolve(this._id);
            }).catch(err => {
                printer.printError(err);
                reject(err);
            });
        });
    }

    /**
     * Method to get the customer data.
     */
    getCustomerDetails() {
        return new Promise((resolve, reject) => {
            database.runSp(constants.SP_GET_CUSTOMER, [this._email, this._phone, this._id]).then(_resultSet => {
                const result = _resultSet[0][0];
                resolve(result);
            }).catch(err => {
                printer.printError(err);
                reject(err);
            });
        });
    }
}

/**
 * Exporting the module.
 */
module.exports = Customer;