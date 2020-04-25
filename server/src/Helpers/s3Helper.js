const awsHelper = require('./awsHelper');
const printer = require('./printer');
const constants = require('./constants');
const path = require('path');
const fs = require('fs');
const s3Helper = {};
/**
 * Method to upload a document file to S3 securely.
 * This method will upload a file to a secure bucket
 * based on the isUploadToSecure parameter. To upload
 * any sensitive document use that parameter as true, else false.
 * @param fileData: The base64 string data of the file.
 * @param fileName: The name of the file with extension.
 * @param isUploadToSecure: true to upload a file to a secure bucket, else false.
 * @returns {Promise<Boolean>}: true if success, else false.
 */
s3Helper.uploadFile = (fileData, fileName, isUploadToSecure) => {
   return new Promise((resolve, reject) => {
      try {
         fs.writeFileSync(fileName, fileData, {encoding: 'base64'});
         let s3Params = {};
         if (isUploadToSecure) {
            s3Params[constants.S3_BUCKET_KEY] = constants.AWS_DOCUMENTS_BUCKET;
         } else {
            s3Params[constants.S3_BUCKET_KEY] = constants.AWS_IMAGES_BUCKET;
         }
         s3Params[constants.S3_KEY_KEY] = fileName;
         s3Params[constants.S3_BODY_KEY] = fs.createReadStream(path.join('./' + fileName));
         awsHelper.s3.upload(s3Params, (err, data) => {
            if (err) {
               printer.printError(err);
               reject(err);
            } else {
               printer.printHighlightedLog(data);
               //deleting the file from local storage.
               fs.unlinkSync(fileName);
               resolve(true);
            }
         });
      } catch (e) {
         printer.printError(e);
         reject(e);
      }
   });
};
/**
 * Exporting the s3 helper.
 * @type {{}}
 */
module.exports = s3Helper;