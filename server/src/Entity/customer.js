const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');

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
     * _country
     * _pincode
     * @param {*} firstName 
     * @param {*} lastName 
     * @param {*} email 
     * @param {*} phone 
     * @param {*} gender 
     * @param {*} address1 
     * @param {*} address2 
     * @param {*} city 
     * @param {*} country 
     * @param {*} pincode 
     */
    constructor(firstName, lastName, email, phone, gender, address1, address2, city, country, pincode) {
        this._firstName = validators.validateString(firstName) ? firstName : false;
        this._lastName = validators.validateString(lastName) ? lastName : false;
        this._email = validators.validateEmail(email) ? email : false;
        this._phone = validators.validatePhone(phone) ? phone : false;
        this._gender = validators.validateCharacter(gender) ? gender : false;
        this._address1 = validators.validateString(address1) ? address1 : false;
        this._address2 = validators.validateString(address2) ? address2 : false;
        this._city = validators.validateNumber(city) ? city : false;
        this._country = validators.validateNumber(country) ? country : false;
        this._pincode = validators.validateNumber(pincode) ? pincode : false;
    }   
    /**
     * Method to create the customer. 
     * @param {String} usedRefarralCode 
     */
    createCustomer(usedRefarralCode){
        return new Promise((resolve,reject)=>{
            database.runSp(constants.SP_CREATE_CUSTOMER,[this.])
        });
    }
}
/**
 * Exporting the module. 
 */
module.exports = Customer;