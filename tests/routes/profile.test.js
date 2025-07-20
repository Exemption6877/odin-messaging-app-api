const app = require("../../app");
const prisma = require("../../prisma/prisma");
const request = require("supertest");

describe("General route tests", () => {
  test("GET /profile route is working", async () => {
    await request(app)
      .get("/profile")
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(403);
  });
});

describe("Methods & Token security", () => {
  const user = {
    username: "tester",
    email: "mail@email.com",
    password: "1234567890",
  };

  const userProfile = {
    desc: "Random description",
    status: "Random status",
  };
  let regUser;
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
  });

  const API_URL = `/profile/${regUser.id}`;

  // Without pfp
  test("POST", async () => {
    const res = await request(app)
      .post(API_URL)
      .set("Authorization", regUser.token)
      .set("Accept", "application/json")
      .send(userProfile)
      .expect(201);

    expect(res.body.desc).toBe("Random description");
    expect(res.body.status).toBe("Random status");
  });

  test("GET with Token", async () => {
    const res = await request(app)
      .get(API_URL)
      .set("Authorization", regUser.token)
      .set("Accept", "application/json")
      .expect(200);

    expect(res.body.desc).toBe("Random description");
    expect(res.body.status).toBe("Random status");
  });

  test("GET without Token", async () => {
    const res = await request(app)
      .get(API_URL)
      .set("Accept", "application/json")
      .expect(200);

    expect(res.body.desc).toBe("Random description");
    expect(res.body.status).toBe("Random status");
  });

  test("UPDATE", async () => {
    const res = await request(app)
      .put(API_URL)
      .set("Authorization", regUser.token)
      .set("Accept", "application/json")
      .send({ desc: "Updated description", status: "Updated status" })
      .expect(200);

    expect(res.body.desc).toBe("Updated description");
    expect(res.body.status).toBe("Updated status");
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
  });
});

describe("No token testing", () => {
  const API_URL = `/profile/2`;

  test("GET /profile accessible without jwt token", async () => {
    await request(app)
      .get(API_URL)
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(200);
  });

  test("POST /profile inaccessible without jwt token", async () => {
    const res = await request(app)
      .post(API_URL)
      .send({ disc: "Whatever" })
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(403);

    expect(res.body.error).toBe("Incorrect credentials");
  });

  test("PUT /profile inaccessible without jwt token", async () => {
    await request(app)
      .put(API_URL)
      .send({ disc: "changed data" })
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(403);

    expect(res.body.error).toBe("Incorrect credentials");
  });
});

// describe("SUPABASE", () => {
//   test("POST SUPABASE creating user folder");
//   //Mocks
//   test("GET SUPABASE profile picture");
//   test("POST SUPABASE profile picture");
//   test("UPDATE SUPABASE profile picture");
//   test("DELETE SUPABASE profile picture");
// });
