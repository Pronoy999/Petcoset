const jwTokenGenerator = require('./../../src/Services/jwTokenGenerator');
test("Should generate correct JwToken", () => {
   expect(jwTokenGenerator.getToken({"first_name": "Pronoy", "id": 1})).toBeInstanceOf(String);
});
test("Should validate token", () => {
   expect(jwTokenGenerator.validateToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiUHJvbm95IiwiaWQiOjEsImlhdCI6MTU4NDk0NjE4MCwiZXhwIjoxNTg0OTYwNTgwfQ.nGbNohJCtaAv79SnbLG3X4RMZx2vfYG6Q_u6zMvYG-TzOvSLt1_B8tGGDgfwGU4yl8EuGoGa3Bl1aTl-rO-f7kEpugHYhi9dEXRvGUgfTqas7dboDvxCxG4_GeXeHYbq56wBg7z-PQS72qRlpkYhHO1hJuq60bD08c8D372wwFEuRi1bY8ivmqrV0uc-A28nEu7IlA8f2GSw2ys8HrWt5Mxk0cDcXKUOcarmtJ3JGKG7oRc14lvw1TzNzvqv-dOvNgVKq2Ae5Av37VeFfylNmCni0ZI_V2mLYUkp8mcQN07_EsTmX4TU2eRWVxCvX_m0T99kCgMI7QKH_AgnKF41GA")).toBeInstanceOf(Object);
});
test("Should return null for invalid token", () => {
   expect(jwTokenGenerator.validateToken("sdsad")).toBe(null);
});