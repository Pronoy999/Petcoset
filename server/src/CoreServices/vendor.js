const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const tokenGenerator = require('./../Services/jwTokenGenerator');
const responseGenerator = require('./../Services/responseGenerator');
const Vendor = require('./../Entity/vendor');
const vendorService = {};
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
            case constants.CORE_VENDOR_CREATE:
                promise = vendorService.createVendor(serviceData[constants.CORE_DATA]);
                break;
            case constants.CORE_VENDOR_GET:
                promise = vendorService.getVendor(serviceData[constants.CORE_DATA]);
                break;
            case constants.CORE_VENDOR_SERVICE_ADD:
                promise = vendorService.addVendorService(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
                break;
            case constants.CORE_VENDOR_2F_VERIFY:
                promise = vendorService.verify2F(serviceData[constants.CORE_DATA]);
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
 * Method to create the vendor.
 * @param dataObject: The vendor data.
 * @returns {Promise<Array>}
 */
vendorService.createVendor = (dataObject) => {
    return new Promise((resolve, reject) => {
        const vendor = new Vendor(false, dataObject[constants.VENDOR_FIRST_NAME], dataObject[constants.VENDOR_LAST_NAME],
            dataObject[constants.VENDOR_EMAIL], dataObject[constants.VENDOR_PHONE_NUMBER], false,
            false, false, false, dataObject[constants.VENDOR_GENDER]);
        vendor.createVendor(dataObject[constants.VENDOR_PASSWORD], dataObject[constants.DOCUMENT_ID_NUMBER],
            dataObject[constants.DOCUMENT_TYPE]).then(vendorID => {
            resolve([vendorID, constants.RESPONSE_SUCESS_LEVEL_1]);
        }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
        });
    });
};
/**
 * Method to get the vendor details.
 * @param dataObject: The search filter.
 * @returns {Promise<Array>}
 */
vendorService.getVendor = (dataObject) => {
    return new Promise((resolve, reject) => {
        const vendor = new Vendor(dataObject[constants.VENDOR_ID], false, false,
            dataObject[constants.VENDOR_EMAIL], dataObject[constants.VENDOR_PINCODE]);
        vendor.getVendor().then(vendorDetails => {
            resolve([vendorDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
        }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
        });
    });
};
/**
 * Method to handle the vendor service mapping.
 * @param dataObject: The required data.
 * @param jwToken: the JwToken of the user.
 * @returns {Promise<unknown>}
 */
vendorService.addVendorService = (dataObject, jwToken) => {
    return new Promise((resolve, reject) => {
        if (tokenGenerator.validateToken(jwToken)) {
            const vendor = new Vendor(dataObject[constants.VENDOR_ID]);
            vendor.createVendorServices(dataObject[constants.SERVICE_ID], dataObject[constants.VENDOR_PET_TYPE], dataObject[constants.VENDOR_IS_BATHING_PROVIDED],
                dataObject[constants.VENDOR_SERVICE_DURATION], dataObject[constants.VENDOR_SERVICE_CHARGE]).then(vendorServiceId => {
                resolve([vendorServiceId, constants.RESPONSE_SUCESS_LEVEL_1]);
            }).catch(err => {
                reject([err, constants.ERROR_LEVEL_3]);
            });
        } else {
            reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
        }
    });
};
/**
 * Method to handle the OTP verification during vendor registration.
 * @param dataObject: The required data.
 * @returns {Promise<Array>}: The response and the success level.
 */
vendorService.verify2F = (dataObject) => {
    return new Promise((resolve, reject) => {
        const vendor = new Vendor(dataObject[constants.VENDOR_ID]);
        vendor.verify2F(dataObject[constants.OTP]).then(vendorDetails => {
            resolve([vendorDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
        }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
        });
    });
};