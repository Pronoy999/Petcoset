const queryGenerator = require('./../../src/Services/queryGenerator');
test("Should generate perfect query", () => {
    expect(queryGenerator.generateSPQuery("sp_insertCustomer", ["Pronoy", 1, "Mukherjee", "mam@a", 2])).toBe("CALL sp_insertCustomer('Pronoy',1,'Mukherjee','mam@a',2");
});