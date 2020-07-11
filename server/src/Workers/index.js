const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const printer = require('./../Helpers/printer');
const generator = require('./../Services/generator');
const validator = require('./../Helpers/validators');
const notificationManager = require('./../Helpers/notificationManager');
const scheduler = require('node-schedule');
const worker = {};
/**
 * Method to initialize the worker.
 */
worker.init = () => {
   startBookingReminder();
};

/**
 * Method to start the booking reminder.
 */
function startBookingReminder() {
   scheduler.scheduleJob('1 0 * * *', () => {
      const nextDate = generator.generateAheadDate(1);
      database.runSp(constants.SP_GET_UPCOMING_BOOKINGS, [nextDate]).then(_resultSet => {
         const result = _resultSet[0];
         if (validator.validateUndefined(result)) {
            result.forEach(async oneBooking => {
               const phoneNumber = oneBooking[constants.CUSTOMER_PHONE_NUMBER];
               const firstName = oneBooking[constants.CUSTOMER_FIRST_NAME];
               const bookingDate = oneBooking[constants.BOOKING_DATE];
               let msg = constants.BOOKING_REMINDER_MESSAGE.replace("%n", firstName);
               msg = msg.replace("%d", bookingDate);
               await notificationManager.sendSMS(msg, phoneNumber);
               printer.printHighlightedLog("Reminder send to " + phoneNumber + " : " + firstName);
            });
         } else {
            printer.printError("No Upcoming bookings present.");
         }
      }).catch(err => {
         printer.printError(err);
      });
   });
}

/**
 * Exporting the workers.
 */
module.exports = worker;