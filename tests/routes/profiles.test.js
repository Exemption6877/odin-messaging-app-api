const app = require("../../app");
const prisma = require("../../prisma/prisma");
const request = require("supertest");

describe("Profile query route", () => {
  const testers = [
    {
      username: "querytest1",
      email: "querytest1@mail.com",
      password: "1234567890",
    },
    {
      username: "querytest2",
      email: "querytest2@mail.com",
      password: "1234567890",
    },
    {
      username: "querytest3",
      email: "querytest3@mail.com",
      password: "1234567890",
    },
  ];

  beforeAll(async () => {
    for (const tester of testers) {
      const resSign = await request(app)
        .post("/auth/signup")
        .send(tester)
        .set("Accept", "application/json");
      const resLogin = await request(app)
        .post("/auth/login")
        .send(tester)
        .set("Accept", "application/json");
      const postProfile = await request(app)
        .post(`/user/${resSign.body.id}/profile`)
        .set("Authorization", resLogin.body.token)
        .send({
          desc: `random desc ${resSign.body.id}`,
          status_msg: `random status ${resSign.body.id}`,
          pfp: `random pfp ${resSign.body.id}`,
        })
        .set("Accept", "application/json");
    }
  });

  test("Full match", async () => {
    const res = await request(app)
      .get("/profiles/?username=querytest")
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(200);

    expect(res.body.length).toBe(3);
  });

  test("No matches", async () => {
    await request(app)
      .get("/profiles/?username=random")
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(404);
  });

  test("Single match", async () => {
    const res = await request(app)
      .get("/profiles/?username=test1")
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(200);

    expect(res.body[0].user.username).toBe("querytest1");
  });

  test("GET all", async () => {
    const res = await request(app)
      .get("/profiles/")
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(200);

    expect(res.body.length).toBe(3);
  });

  afterAll(async () => {
    for (const tester of testers) {
      await prisma.user.deleteMany({ where: { email: tester.email } });
    }
  });
});
