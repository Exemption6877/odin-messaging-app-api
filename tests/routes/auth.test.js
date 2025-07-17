const app = require("../../app");
const prisma = require("../../prisma/prisma");
const request = require("supertest");

describe("/signup & /login", () => {
  const user = {
    username: "tester",
    email: "test@tester.com",
    password: "576334ddS",
  };

  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
  });

  test("POST /signup", (done) => {
    request(app)
      .post("/auth/signup")
      .send(user)
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect((res) => {
        expect(res.body.username).toBe(user.username);
        expect(res.body.email).toBe(user.email);
      })
      .expect(201, done);
  });

  test("POST /login", (done) => {
    request(app)
      .post("/auth/login")
      .send(user)
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(200, done);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
  });
});
