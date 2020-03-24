const Subscription = require('./../../src/Entity/subscription');
test("Should generate the service count array", () => {
   const subscription = new Subscription(false, "New Subs", 100.23);
   subscription.createSubscription([{"3": 2}, {"3": 4}], 1).then(data => {
      expect(data).toBe(['3, 3', '2, 4']);
   }).catch(err => {
      expect(err).toBeInstanceOf(Object);
   });
});