const awsHelper = {};
const aws = require('aws-sdk');
const encrypterDecrypter = require('./encrypterDecrypter');
const constants = require('./constants');
aws.config.update({
   region: 'ap-south-1',
   accessKeyId: encrypterDecrypter.decrypt(process.env[constants.AWS_KEY_ID]),
   secretAccessKey: encrypterDecrypter.decrypt(process.env[constants.AWS_SECRET_KEY])
});
awsHelper.sns = new aws.SNS();
awsHelper.s3 = new aws.S3({apiVersion: '2006-03-01'});
/**
 * Exporting the module.
 */
module.exports = awsHelper;