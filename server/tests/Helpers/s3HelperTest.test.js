const s3Helper = require('./../../src/Helpers/s3Helper');
test("Upload a file to AWS S3 Bucket", () => {
   const base64String = "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";
   s3Helper.uploadDocuments(base64String, "test.png").then(isUploaded => {
      console.log(isUploaded);
      expect(isUploaded).toBe(true);
   }).catch(err => {
      console.error(err);
   });
});