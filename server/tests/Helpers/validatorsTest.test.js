const validators = require('./../../src/Helpers/validators');
test("Should validate Numbers when false", () => {
   expect(validators.validateNumber(false)).toBe(false);
});
test("Should validate Numbers when undefined", () => {
   expect(validators.validateNumber(undefined)).toBe(false);
});
test("Should validate Null in undefined check", () => {
   expect(validators.validateUndefined(null)).toBe(false);
});