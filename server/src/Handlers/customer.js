const customerHandler = {};
const constants = require('./../Helpers/constants');
const validator = require('./../Helpers/validators');
customerHandler.customer = (dataObject) => {
    return new Promise((resolve, reject) => {
        const method = dataObject.method;
        if (method === constants.HTTP_POST) {
            const firstName = validator.validateString(dataObject.postData[constants.CUSTOMER_FIRST_NAME]) ?
                dataObject.postData[constants.CUSTOMER_FIRST_NAME] : false;
            const lastName = validator.validateString(dataObject.postData[constants.CUSTOMER_LAST_NAME]) ?
                dataObject.postData[constants.CUSTOMER_LAST_NAME] : false;
            const email = validator.validateEmail(dataObject.postData[constants.CUSTOMER_EMAIL]) ?
                dataObject.postData[constants.CUSTOMER_EMAIL] : false;
            const phoneNumber = validator.validatePhone(dataObject.postData[constants.CUSTOMER_PHONE_NUMBER]) ?
                dataObject.postData[constants.CUSTOMER_PHONE_NUMBER] : false;
            const gender = validator.validateCharacter(dataObject.postData[constants.CUSTOMER_GENDER]) ?
                dataObject.postData[constants.CUSTOMER_GENDER] : false;
            const address1 = validator.validateString(dataObject.postData[constants.CUSTOMER_ADDRESS_1]) ?
                dataObject.postData[constants.CUSTOMER_ADDRESS_1] : false;
            const address2 = validator.validateString(dataObject.postData[constants.CUSTOMER_ADDRESS_2]) ?
                dataObject.postData[constants.CUSTOMER_ADDRESS_2] : false;
            const city = validator.validateNumber(dataObject.postData[constants.CUSTOMER_CITY]) ?
                dataObject.postData[constants.CUSTOMER_CITY] : false;
            const country = validator.validateNumber(dataObject.postData[constants.CUSTOMER_COUNTRY]) ?
                dataObject.postData[constants.CUSTOMER_COUNTRY] : false;
            const pincode = validator.validateNumber(dataObject.postData[constants.CUSTOMER_PINCODE]) ?
                dataObject.postData[constants.CUSTOMER_PINCODE] : false;
            const usedCode = validator.validateString(dataObject.postData[constants.CUSTOMER_USED_REFERAL_CODE]) ?
                dataObject.postData[constants.CUSTOMER_USED_REFERAL_CODE] : false;
            //TODO: Create the customer. 
        } else {

        }
    });
};

module.exports = customerHandler;