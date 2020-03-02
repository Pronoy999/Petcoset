const constants = require('./constants');
const logger = require('./../Loggers');
const printer = {};
/**
 * Method to print Error Message to Console.
 * @param errorMessage: The error Message.
 */
printer.printError = (errorMessage) => {
    console.log(constants.COLOR_RED, errorMessage);
    logger.appendLogs(errorMessage).then(err => {
        console.error(constants.COLOR_GREEN, "Logs Updated.");
    }).catch(err => {
        console.error(constants.COLOR_RED, err);
    });
};
/**
 * Method to print Highlighted Log.
 * @param text: The text to be printed.
 */
printer.printHighlightedLog = (text) => {
    console.log(constants.COLOR_GREEN, text);
    logger.appendLogs(text).then(err => {
        console.error(constants.COLOR_GREEN, "Logs Updated.");
    }).catch(err => {
        console.error(constants.COLOR_RED, err);
    });
};
/**
 * Method to print normal log.
 * @param text: The text to be printed.
 */
printer.printLog = (text) => {
    console.log(text);
};
/**
 * Exporting the modules.
 */
module.exports = printer;