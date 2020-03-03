const fs = require('fs');
const path = require('path');
const constants = require('./../Helpers/constants');
const generator = require('./../Services/generator');
const logger = {};
logger.baseDir = path.join(__dirname, "/.Logs");
/**
 * Method to append the log data to the append files.
 * @param logData: The data to be appended.
 * @returns {Promise<any>}
 */
logger.appendLogs = (logData) => {
    const formattedDate = generator.generateCurrentTime();
    return new Promise((resolve, reject) => {
        fs.appendFile(logger.baseDir + "/" + constants.LOG_FILE_NAME,
            formattedDate + " : " + logData + "\n\n", 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(false);
                }
            });
    });
};
/**
 * Exporting the Loggers.
 */
module.exports = logger;