const responseGenerator = require('./../../src/Services/responseGenerator');
test("Should generate correct Response", () => {
   expect(responseGenerator.generateResponse("Correct", "1")).toBeInstanceOf(Object);
});
test("Should Return null for Incorrect parameter", () => {
   expect(responseGenerator.generateResponse(false, false)).toBe(null);
});
test("Should generate correct Error Response", () => {
   expect(responseGenerator.generateErrorResponse(false, "3")).toBeInstanceOf(Object);
});
test("Should return null for incorrect paramater for error response",()=>{
   expect(responseGenerator.generateErrorResponse(false, null)).toBe(null);
});