const database = require('./../Services/databaseService');
const constants = require('./../Helpers/constants');
const validators = require('./../Helpers/validators');
const generator = require('./../Services/generator');
const printer = require('./../Helpers/printer');
const tokenGenerator = require('./../Services/jwTokenGenerator');

class Breed {
   /**
    * _breedID
    * _petType
    * @param breedID
    * @param petType
    */
   constructor(breedID, petType) {
      this._breedID = validators.validateNumber(breedID) ? breedID : false;
      this._petType = validators.validateNumber(petType) ? petType : false;
   }
   
   /**
    * Method to get the breed details.
    * @returns {Promise<unknown>}
    */
   getBreedDetails() {
      return new Promise((resolve, reject) => {
         database.runSp(constants.SP_GET_BREED_DETAILS, [this._petType]).then(_resultSet => {
            const result = _resultSet[0];
            if (validators.validateUndefined(result)) {
               resolve(result);
            } else {
               resolve([]);
            }
         }).catch(err => {
            printer.printError(err);
            reject(err);
         });
      });
   }
}

/**
 * Exporting the module.
 * @type {Breed}
 */
module.exports = Breed;