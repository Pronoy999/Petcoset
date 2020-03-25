const generator = require('./../../src/Services/generator');
test("Should generate correct difference between 2 dates", () => {
    expect(generator.generateDateDifference("2020-03-25", "2020-03-25")).toBe(0);
});