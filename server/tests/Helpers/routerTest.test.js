const router = require('./../../src/Helpers/router');
test("Should resolve the path from router", () => {
    expect(router.getPath("services")).toBeInstanceOf(Object);
});