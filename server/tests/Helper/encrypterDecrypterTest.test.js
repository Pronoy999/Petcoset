const encrypterDecrypter = require("./../../src/Helpers/encrypterDecrypter");
test("Should Encrypt a String", () => {
    require("dotenv").config();
    expect(encrypterDecrypter.encrypt("Hello")).toBe("1d054cc3d09edd8dc7d81a7937fe5998");
});
test("should Decrypt a String", () => {
    require("dotenv").config();
    expect(encrypterDecrypter.decrypt("1d054cc3d09edd8dc7d81a7937fe5998")).toBe("Hello");
});