const request = require("supertest");
const app = require("../../app");

test("index route works", (done) => {
  request(app)
    .get("/")
    .expect("Content-type", /json/)
    .expect({ name: "main route" })
    .expect(200, done);
});
