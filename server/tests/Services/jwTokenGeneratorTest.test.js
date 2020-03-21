const jwTokenGenerator = require('./../../src/Services/jwTokenGenerator');
test("Should generate corrent JwToken", () => {
   expect(jwTokenGenerator.getToken({"first_name": "Pronoy", "id": 1})).toBe(String);
});
test("Should validate token", () => {
   expect(jwTokenGenerator.validateToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiUHJvbm95IiwiaWQiOjEsImlhdCI6MTU4NDc4NDk0NSwiZXhwIjoxNTg0Nzk5MzQ1fQ.fOPZMUMatqhfpNHUfTrUfBSlXwH1hSKfeXO-Y48cNjgEX_IhBtjAttx9aHp4cpGh7Mmw5Gx7C1SV5D59Vs7OZgmM-zPYO9rwIyhm6fxXi0Tq3zznprVF0Zw9Fdh2VXe5Ry0xikLG7wd3rxsFeI85y2YBpjGeLLIhCV5lq9bCRWlWBJ5mjrRLqQgois7baONZrxnn4HMnPp2qPnq8xvzTg1OBXkCvPZu7zJDdeAAoqxmhpXCo34CimhfzBWEDLs28fX1q5sUA-bUurqCpPLi-62o3H4AIrqJuMUJxxM-O6YCSHtf183WhDyHPHG6LgelJnvyoTctBgO2jFbDlWot0wA")).toBeInstanceOf(Object);
});