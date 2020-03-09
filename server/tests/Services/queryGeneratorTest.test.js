const queryGenerator = require('./../../src/Services/queryGenerator');
test("Should generate perfect query", () => {
    expect(queryGenerator.generateSPQuery("sp_insertCustomer", ["Pronoy", 1, "Mukherjee", "mam@a", 2]))
        .toBe("CALL sp_insertCustomer('Pronoy',1,'Mukherjee','mam@a',2)");
});
test("Should generate query with only number parameters",()=>{
    expect(queryGenerator.generateSPQuery("sp_insertCustomer",[1,2,3]))
        .toBe("CALL sp_insertCustomer(1,2,3)");
});
test("Should generate perfect query even with undefined data.", () => {
    expect(queryGenerator.generateSPQuery("sp_insertCustomer", ["Pronoy", 1, "Mukherjee", "mam@a", 2,undefined]))
        .toBe("CALL sp_insertCustomer('Pronoy',1,'Mukherjee','mam@a',2)");
});