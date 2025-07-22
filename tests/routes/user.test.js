const app = require("../../app");
const prisma = require("../../prisma/prisma");
const request = require("supertest");

// test route for getting wrong user with jwt token

describe("Methods", () => {
  const user = {
    username: "testeruser1",
    email: "testeruser33@email.com",
    password: "1234567890",
  };

  let regUser;
  let API_URL;

  beforeAll(async () => {
    const testUser = await request(app)
      .post("/auth/signup")
      .send(user)
      .set("Accept", "application/json")
      .expect(201);

    const result = testUser.body;

    const login = await request(app)
      .post("/auth/login")
      .send(user)
      .set("Accept", "application/json")
      .expect(200);

    const loginResult = login.body;

    regUser = {
      id: result.id,
      username: result.username,
      email: result.email,
      token: loginResult.token,
    };
    console.log(regUser.token);
    API_URL = `/user/${regUser.id}`;
  });

  test("GET by ID", async () => {
    const res = await request(app)
      .get(API_URL)
      .set("Authorization", regUser.token)
      .set("Accept", "application/json")
      .expect(200);

    expect(res.body.username).toBe("testeruser1");
    expect(res.body.email).toBe("testeruser33@email.com");
    expect(res.body.password.length).toBeGreaterThan(0);
  });

  test("PUT", async () => {
    const res = await request(app)
      .put(API_URL)
      .send({
        username: "changedname22",
        email: "changed22@email.com",
        password: "74564585889",
        confirmPassword: "1234567890",
      })
      .set("Authorization", regUser.token)
      .set("Accept", "application/json")
      .expect(201);

    expect(res.body.username).toBe("changedname22");
    expect(res.body.email).toBe("changed22@email.com");
    expect(res.body.password.length).toBeGreaterThan(0);
  });

  test("PUT with wrong confirmPassword", async () => {
    const res = await request(app)
      .put(API_URL)
      .send({
        username: "changedname23",
        email: "changed23@email.com",
        password: "74564585889",
        confirmPassword: "1234567890",
      })
      .set("Authorization", regUser.token)
      .set("Accept", "application/json")
      .expect(401);

    expect(res.body.error).toBe("Incorrect password");
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
  });
});

describe("Unauthorized requests", () => {
  const user = {
    username: "tester",
    email: "tester@email.com",
    password: "1234567890",
  };
  let regUser;
  let API_URL;

  beforeAll(async () => {
    const testUser = await request(app)
      .post("/auth/signup")
      .send(user)
      .set("Accept", "application/json")
      .expect(201);

    const result = testUser.body;
    regUser = {
      id: result.id,
      username: result.username,
      email: result.email,
    };
    API_URL = `/user/${regUser.id}`;
  });

  test("GET without token", async () => {
    await request(app)
      .get(API_URL)
      .set("Accept", "application/json")
      .expect(401);
  });

  test("PUT without token", async () => {
    await request(app)
      .put(API_URL)
      .send({ username: "changedname", email: "changedemail" })
      .set("Accept", "application/json")
      .expect(401);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
  });
});
