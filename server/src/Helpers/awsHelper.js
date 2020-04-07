const awsHelper = {};
const aws = require('aws-sdk');
const encrypterDecrypter = require('./encrypterDecrypter');
const constants = require('./constants');
aws.config.update({
   region: 'ap-southeast-1',
   accessKeyId: encrypterDecrypter.decrypt(process.env[constants.AWS_KEY_ID]),
   secretAccessKey: encrypterDecrypter.decrypt(process.env[constants.AWS_SECRET_KEY])
});
awsHelper.sns = new aws.SNS();
/**
 * Exporting the module.
 * @type {{}}
 */
module.exports = awsHelper;