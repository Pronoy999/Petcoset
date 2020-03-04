const config = {};
config.port = 7010;

/**
 * data base configurations.
 * @type {string}
 */
config.databasePort = 3306;
config.databaseUserName = "petcoset_db";
config.databaseName = "petcoset";

/**
 * Encryption constants
 */
config.ENCRYPT_ALGO = "aes256";
config.ENCRYPT_ENCODING = "hex";

/**
 * exporting the Config.
 */
module.exports = config;