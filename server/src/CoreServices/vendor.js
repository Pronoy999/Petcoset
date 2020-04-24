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
         case constants.CORE_VENDOR_SERVICE_GET:
            promise = vendorService.getVendorService(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_VENDOR_2F_VERIFY:
            promise = vendorService.verify2F(serviceData[constants.CORE_DATA]);
            break;
         case constants.CORE_VENDOR_BANK:
            promise = vendorService.details(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_VENDOR_BANK_UPDATE:
            promise = vendorService.updatePaymentGatewayDetails(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_VENDOR_BANK_GET:
            promise = vendorService.getBankDetails(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_VENDOR_UPDATE:
            promise = vendorService.update(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         case constants.CORE_VENDOR_GET_BOOKINGS:
            promise = vendorService.getVendorBooking(serviceData[constants.CORE_DATA], serviceData[constants.CORE_TOKEN]);
            break;
         default:
            process.send(responseGenerator.generateCoreResponse(false, false, constants.INVALID_PATH, constants.ERROR_LEVEL_1));
            process.exit(1);
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
         vendor.createVendorServices(dataObject[constants.SERVICE_ID], dataObject[constants.VENDOR_PET_TYPE],
            dataObject[constants.VENDOR_IS_BATHING_PROVIDED], dataObject[constants.VENDOR_IS_MASSAGE_PROVIDED],
            dataObject[constants.VENDOR_IS_CLEANING_PROVIDED], dataObject[constants.VENDOR_IS_FUR_TRIMMING_PROVIDED],
            dataObject[constants.VENDOR_PET_SEX], dataObject[constants.VENDOR_PET_AGE],
            dataObject[constants.VENDOR_IS_PEDIGREE_CERTIFICATE], dataObject[constants.VENDOR_IS_MEDICAL_CERTIFICATE],
            dataObject[constants.VENDOR_IS_IMMUNIZATION_CERTIFICATE], dataObject[constants.VENDOR_IS_BEHAVIOURAL_MODIFICATION],
            dataObject[constants.VENDOR_IS_OBIDIENCE_TRAINING], dataObject[constants.VENDOR_IS_SCIENTIFIC_TRANING],
            dataObject[constants.VENDOR_IS_AGILITY_TRAINING], dataObject[constants.VENDOR_IS_THERAPY_TRAINING],
            dataObject[constants.VENDOR_NUM_DOGS_TRAINED_AT_A_TIME], dataObject[constants.VENDOR_HAS_HOUSE],
            dataObject[constants.VENDOR_HAS_FENCED_GARDEN], dataObject[constants.VENDOR_IS_PETS_ALLOWED_FURNITURE],
            dataObject[constants.VENDOR_IS_PETS_ON_BED], dataObject[constants.VENDOR_IS_NO_SMOKING],
            dataObject[constants.VENDOR_DOES_OWN_DOG], dataObject[constants.VENDOR_DOES_OWN_CAT],
            dataObject[constants.VENDOR_DOES_OWN_CAGED_ANIMALS], dataObject[constants.VENDOR_ONLY_ONE_BOOKING],
            dataObject[constants.VENDOR_PET_WEIGHT], dataObject[constants.VENDOR_NUMBER_VISITS],
            dataObject[constants.VENDOR_SERVICE_DURATION], dataObject[constants.VENDOR_SERVICE_PER_WEEK],
            dataObject[constants.VENDOR_SERVICE_CHARGE])
            .then(vendorServiceId => {
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
 * Method to handle request for vendors service search.
 * @param dataObject: The required data.
 * @param jwToken: The token of the user.
 * @returns {Promise<Array>}
 */
vendorService.getVendorService = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (tokenGenerator.validateToken(jwToken)) {
         const vendor = new Vendor(dataObject[constants.VENDOR_ID]);
         vendor.getVendorService().then(serviceList => {
            resolve([serviceList, constants.RESPONSE_SUCESS_LEVEL_1]);
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
/**
 * Method to handle the bank account details for the vendor.
 * @param dataObject: The required data.
 * @param jwToken: The token of the user.
 * @returns {Promise<Array>}: The response object and the success or error level.
 */
vendorService.details = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (tokenGenerator.validateToken(jwToken)) {
         const vendor = new Vendor(dataObject[constants.BANK_ACCOUNT_HOLDER_ID], false, false, false, dataObject[constants.BANK_ACCOUNT_CONTACT_NUMBER]);
         vendor.createUpdateBankDetails(dataObject[constants.BANK_ACCOUNT_HOLDER_NAME], dataObject[constants.BANK_ACCOUNT_ACCOUNT_NUMBER],
            dataObject[constants.BANK_ACCOUNT_BANK_NAME], dataObject[constants.BANK_ACCOUNT_IFSC_CODE],
            dataObject[constants.BANK_ACCOUNT_IS_UPDATE])
            .then(bankDetails => {
               resolve([bankDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
            }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Method to handle the bank details search.
 * @param dataObject: The required data.
 * @param jwToken: The token of the user.
 * @returns {Promise<unknown>}
 */
vendorService.getBankDetails = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (tokenGenerator.validateToken(jwToken)) {
         const vendor = new Vendor(dataObject[constants.VENDOR_ID]);
         vendor.getBankDetails().then(bankDetails => {
            resolve([bankDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
         }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Method to update the payment gateway details.
 * @param dataObject: The required data.
 * @param jwToken: The user token.
 * @returns {Promise<Array>}
 */
vendorService.updatePaymentGatewayDetails = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (tokenGenerator.validateToken(jwToken)) {
         const vendor = new Vendor(dataObject[constants.VENDOR_ID]);
         vendor.updateBankDetails(dataObject[constants.BANK_ACCOUNT_ACCOUNT_NUMBER], dataObject[constants.BANK_ACCOUNT_PAYMENT_GATEWAY_ID])
            .then(updateDetails => {
               resolve([updateDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
            }).catch(err => {
            reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Method to update the vendor details.
 * @param dataObject: The required data.
 * @param jwToken: The token of the user.
 * @returns {Promise<Array>}: the response and the success or error level.
 */
vendorService.update = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (tokenGenerator.validateToken(jwToken)) {
         const vendor = new Vendor(dataObject[constants.VENDOR_ID], dataObject[constants.VENDOR_FIRST_NAME],
            dataObject[constants.VENDOR_LAST_NAME], dataObject[constants.VENDOR_EMAIL],
            dataObject[constants.VENDOR_PHONE_NUMBER], dataObject[constants.VENDOR_ADDRESS_1],
            dataObject[constants.VENDOR_ADDRESS_2], dataObject[constants.VENDOR_PINCODE],
            dataObject[constants.VENDOR_CITY]);
         vendor.updateVendorDetails(dataObject[constants.VENDOR_PASSWORD]).then(updateDetails => {
            resolve([updateDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
         }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};
/**
 * Method to handle the booking details for vendor.
 * @param dataObject: The required data.
 * @param jwToken: The user token.
 * @returns {Promise<Array>}
 */
vendorService.getVendorBooking = (dataObject, jwToken) => {
   return new Promise((resolve, reject) => {
      if (tokenGenerator.validateToken(jwToken)) {
         const vendor = new Vendor(dataObject[constants.VENDOR_ID]);
         vendor.getVendorBooking(dataObject[constants.BOOKING_DATE], dataObject[constants.BOOKING_TIME])
            .then(bookingDetails => {
               resolve([bookingDetails, constants.RESPONSE_SUCESS_LEVEL_1]);
            }).catch(err => {
            reject([err, constants.ERROR_LEVEL_3]);
         });
      } else {
         reject([constants.FORBIDDEN_MESSAGE, constants.ERROR_LEVEL_4]);
      }
   });
};