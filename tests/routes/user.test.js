const app = require("../../app");
const prisma = require("../../prisma/prisma");
const request = require("supertest");

describe("Methods", () => {
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
      .expect(200);

    const result = testUser.body;
    regUser = {
      id: result.id,
      username: result.username,
      email: result.email,
      token: result.token,
    };
    API_URL = `/user/${regUser.id}`;
  });

  test("GET by ID", async () => {
    const res = await request(app)
      .get(API_URL)
      .set("Authorization", regUser.token)
      .set("Accept", "application/json")
      .expect(200);

    expect(res.body.username).toBe("tester");
    expect(res.body.email).toBe("tester@email.com");
    expect(res.body.password.length).toBeGreaterThan(0);
  });

  test("PUT", async () => {
    const res = await request(app)
      .put(API_URL)
      .send({ username: "changedname", email: "changed@email.com" })
      .set("Authorization", regUser.token)
      .set("Accept", "application/json")
      .expect(201);

    expect(res.body.username).toBe("changedname");
    expect(res.body.email).toBe("changed@email.com");
    expect(res.body.password.length).toBeGreaterThan(0);
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
      .expect(200);

    const result = testUser.body;
    regUser = {
      id: result.id,
      username: result.username,
      email: result.email,
    };
    API_URL = `/user/${regUser.id}`;
  });
  test("GET without token", async () => {
    const res = await request(app)
      .get(API_URL)
      .set("Accept", "application/json")
      .expect(403);
    expect(res.body.error).toBe("Unauthorized request");
  });

  test("PUT without token", async () => {
    const res = await request(app)
      .put(API_URL)
      .send({ username: "changedname", email: "changedemail" })
      .set("Accept", "application/json")
      .expect(403);
    expect(res.body.error).toBe("Unauthorized request");
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
  });
});
