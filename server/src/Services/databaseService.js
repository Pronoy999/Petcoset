const mysql = require('mysql');
const printer = require('./../Helpers/printer');
const validators = require('./../Helpers/validators');
const queryGenerator = require('./queryGenerator');
const config = require('./../Helpers/config');
const constants = require('./../Helpers/constants');
const encrypterDecrypter = require("./../Helpers/encrypterDecrypter");
/**
 * Creating pool for Database.
 * @type {Pool}
 */
const pool = mysql.createPool({
   host: encrypterDecrypter.decrypt(process.env[constants.DB_HOST_KEY]),
   user: config.databaseUserName,
   database: config.databaseName,
   password: encrypterDecrypter.decrypt(process.env[constants.DB_PASSWORD_KEY]),
   port: config.databasePort
});
const database = {};
/**
 * Method to execute the queries.
 * @param queries: The queries to be executed.
 * @returns {Promise<any>}
 */
database.query = (queries) => {
   return new Promise((resolve, reject) => {
      if (!validators.validateArray(queries)) {
         reject("NOT AN ARRAY.");
         return;
      }
      pool.getConnection((err, conn) => {
         if (err) {
            reject(err);
            printer.printError(err);
            conn.release();
         } else {
            conn.beginTransaction((err) => {
               if (err) {
                  printer.printError(err.stack);
                  conn.release();
                  reject(err);
               }
               let position = 0;
               let resultSet = [];
               getAndRunQuery(position);

               /**
                * Recursive method to execute the individual queries.
                * @param pos: the current position to be executed.
                */
               function getAndRunQuery(pos) {
                  printer.printLog(queries[pos]);
                  database._runQuery(queries[pos], conn).then(result => {
                     pos++;
                     printer.printHighlightedLog("Query :" + pos + " executed.");
                     resultSet.push(result);
                     if (pos < queries.length) {
                        getAndRunQuery(pos);
                     } else {
                        conn.commit(err => {
                           if (err) {
                              conn.rollback(err => {
                                 if (err) {
                                    printer.printError(err.stack);
                                 }
                                 conn.release();
                                 reject(err);
                              });
                           } else {
                              conn.release();
                              resolve(resultSet);
                           }
                        });
                     }
                  }).catch(err => {
                     printer.printError(err.stack);
                     conn.rollback(err => {
                        if (err) {
                           printer.printError(err.stack);
                        } else {
                           printer.printHighlightedLog("Transactions roll backed.");
                        }
                        conn.release();
                        reject(err);
                     });
                  });
               }
            });
         }
      });
   });
};
/**
 * Method to execute single Query.
 * @param queryStatement: The Query Statement to be executed.
 * @param connection: The Database connection.
 * @returns {Promise<any>}: error.
 * @private:
 */
database._runQuery = (queryStatement, connection) => {
   return new Promise((resolve, reject) => {
      if (validators.validateString(queryStatement)) {
         printer.printHighlightedLog(queryStatement);
         connection.query(queryStatement, (err, result, fields) => {
            if (err) {
               printer.printError(err.stack);
               printer.printError("WRONG QUERY: " + queryStatement);
               reject(err);
            } else {
               resolve(result);
            }
         });
      }
   });
};
/**
 * Method to execute the Stored Procedures.
 * @param spName: The name of the SPs.
 * @param params: The array containing the params for the SP.
 * @returns {Promise<unknown>}: Resolves result if executed, else false.
 */
database.runSp = (spName, params) => {
   return new Promise((resolve, reject) => {
      if (!validators.validateString(spName)) {
         reject("Invalid SP Name");
         return;
      }
      let spQuery = queryGenerator.generateSPQuery(spName, params);
      printer.printHighlightedLog(spQuery);
      pool.getConnection((err, conn) => {
         if (err) {
            printer.printError(err);
            reject(err);
         } else {
            conn.query(spQuery, (err, results) => {
               conn.release();
               if (err) {
                  printer.printError(err);
                  reject(err);
               } else {
                  printer.printHighlightedLog("Query :" + spQuery + " Executed.");
                  resolve(results);
               }
            });
         }
      });
   });
};
/**
 * Exporting modules.
 */
module.exports = database;