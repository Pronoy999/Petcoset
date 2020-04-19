const fs = require('fs');
const path = require('path');
const constants = require('./../Helpers/constants');
const generator = require('./../Services/generator');
const childProcess = require('child_process');
const logger = {};
/**
 * Method to append the log data to the append files.
 * @param logData: The data to be appended.
 * @returns {Promise<any>}
 */
logger.appendLogs = (logData) => {
   logger.baseDir = path.join(__dirname, "/.Logs");
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
 * Method to log the API Status.
 * @param requestKey: The request key.
 * @param apiPath: The Endpoint.
 * @param responseCode: The Response code.
 * @param apiKey: The API Token key.
 */
logger.logApiRequest = (requestKey, apiPath, responseCode, apiKey) => {
   const printer = require('./../Helpers/printer');
   let serviceData = {};
   serviceData[constants.CORE_SERVICE_USER_NAME] = process.env[constants.CORE_SERVICE_USER_NAME];
   serviceData[constants.CORE_SERVICE_PASSWORD] = process.env[constants.CORE_SERVICE_PASSWORD];
   serviceData[constants.CORE_TYPE] = constants.CORE_API_LOG;
   let coreData = {};
   coreData[constants.API_REQUEST_KEY] = requestKey;
   coreData[constants.API_PATH] = apiPath;
   if (responseCode === constants.HTTP_SUCCESS)
      coreData[constants.API_LOGGER_STATUS] = constants.STATUS_COMPLETED;
   else if (responseCode === constants.HTTP_ACCEPTED_OKAY)
      coreData[constants.API_LOGGER_STATUS] = constants.STATUS_PROCESSING;
   else
      coreData[constants.API_LOGGER_STATUS] = constants.STATUS_ERROR;
   coreData[constants.API_TOKEN_KEY] = apiKey;
   coreData[constants.API_LOGGER_RESPONSE_CODE] = responseCode;
   serviceData[constants.CORE_DATA] = coreData;
   const childWorker = childProcess.fork(`${__dirname}/../CoreServices/api.js`);
   childWorker.send(serviceData);
   childWorker.on("message", (childReply) => {
      printer.printHighlightedLog(childReply);
   });
};
/**
 * Exporting the Loggers.
 */
module.exports = logger;