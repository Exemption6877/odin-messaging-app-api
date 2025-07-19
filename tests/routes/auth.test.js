const app = require("../../app");
const prisma = require("../../prisma/prisma");
const request = require("supertest");
const bcrypt = require("bcrypt");

const saltRounds = 10;

describe("Sign Up & Login", () => {
  const user = {
    username: "tester",
    email: "test@tester.com",
    password: "576334ddS",
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
  });

  test("POST /signup", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send(user)
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(201);

    expect(res.body.username).toBe(user.username);
    expect(res.body.email).toBe(user.email);
  });

  test("POST /login", async () => {
    await request(app)
      .post("/auth/login")
      .send(user)
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(200);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
  });
});

describe("Sign Up User input validation", () => {
  const testers = [
    {
      username: "validator0",
      email: "shortpassword@tester.com",
      password: "1234",
    },
    {
      username: "validator1",
      email: "longpassword@tester.com",
      password: "123456789012345678901234567890",
    },
    {
      username: "validator2",
      email: "notemail",
      password: "235555347457",
    },
    { username: "3", email: "shortusername@tester.com", password: "123456789" },
    {
      username:
        "validator4withveryveryveryveryveryveryveryveryveryveryveryverylongname",
      email: "longusername@tester.com",
      password: "123456789",
    },

    { username: "validator5", email: "forgotpassword@tester.com" },
    { username: "validator6", password: "forgotemail" },
    { email: "forgotusername@tester.com", password: "123456789" },
    {
      /* Forgot everything */
    },
  ];

  beforeAll(async () => {
    for (const tester of testers) {
      await prisma.user.deleteMany({ where: { email: tester.email } });
    }
  });

  describe("Password validation", () => {
    test("Password is < 8 chars", async () => {
      await request(app)
        .post("/auth/signup")
        .send(testers[0])
        .set("Accept", "application/json")
        .expect("Content-type", /json/)
        .expect(400);
    });

    test("Password is > 24 chars ", async () => {
      await request(app)
        .post("/auth/signup")
        .send(testers[1])
        .set("Accept", "application/json")
        .expect("Content-type", /json/)
        .expect(400);
    });
  });

  describe("Email validation", () => {
    test("Email body is not email type", async () => {
      await request(app)
        .post("/auth/signup")
        .send(testers[2])
        .set("Accept", "application/json")
        .expect("Content-type", /json/)
        .expect(400);
    });
  });

  describe("Username validation", () => {
    test("Username is < 3 chars", async () => {
      await request(app)
        .post("/auth/signup")
        .send(testers[3])
        .set("Accept", "application/json")
        .expect("Content-type", /json/)
        .expect(400);
    });

    test("Username is > 32 chars", async () => {
      await request(app)
        .post("/auth/signup")
        .send(testers[4])
        .set("Accept", "application/json")
        .expect("Content-type", /json/)
        .expect(400);
    });
  });

  describe("Missing fields", () => {
    test("Missing password", async () => {
      await request(app)
        .post("/auth/signup")
        .send(testers[5])
        .set("Accept", "application/json")
        .expect("Content-type", /json/)
        .expect(400);
    });
    test("Missing email", async () => {
      await request(app)
        .post("/auth/signup")
        .send(testers[6])
        .set("Accept", "application/json")
        .expect("Content-type", /json/)
        .expect(400);
    });
    test("Missing username", async () => {
      await request(app)
        .post("/auth/signup")
        .send(testers[7])
        .set("Accept", "application/json")
        .expect("Content-type", /json/)
        .expect(400);
    });

    test("Missing all fields", async () => {
      await request(app)
        .post("/auth/signup")
        .send(testers[8])
        .set("Accept", "application/json")
        .expect("Content-type", /json/)
        .expect(400);
    });
  });

  afterAll(async () => {
    for (const tester of testers) {
      await prisma.user.deleteMany({ where: { email: tester.email } });
    }
  });
});

describe("Login status validation", () => {
  const testers = [
    {
      username: "tester",
      email: "test@tester.com",
      password: "576334ddS",
    },

    {
      username: "idonotexist",
      email: "idonotexistatlall@notexisting.com",
      password: "longpassword",
    },
  ];

  beforeAll(async () => {
    await request(app)
      .post("/auth/signup")
      .send(testers[0])
      .set("Accept", "application/json");
  });

  test("User does not exist", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send(testers[1])
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(400);
    expect(res.body.error).toBe("Incorrect credentials");
  });

  test("Incorrect password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ ...testers[0], password: "incorrectpassword" })
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(400);

    expect(res.body.error).toBe("Incorrect credentials");
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testers[0].email } });
  });
});

describe("Sign Up status validation", () => {
  const testers = [
    {
      username: "existingusername",
      email: "existing@mail.com",
      password: "longpassword",
    },
    {
      username: "firstname",
      email: "first@notexisting.com",
      password: "longpassword",
    },
    {
      username: "existingusername",
      email: "second@exist.com",
      password: "longpassword",
    },
    {
      username: "secondname",
      email: "existing@mail.com",
      password: "longpassword",
    },
  ];

  beforeAll(async () => {
    await prisma.user.create({ data: testers[0] });
    await prisma.user.create({ data: testers[1] });
  });

  test("Username has been taken", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send(testers[2])
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(403);

    expect(res.body.error).toBe("Username has been already taken");
  });

  test("Email has been taken", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send(testers[3])
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(403);

    expect(res.body.error).toBe("Email has been already taken");
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testers[0].email } });
    await prisma.user.deleteMany({ where: { email: testers[1].email } });
  });
});

// Implement github auth
// Handle all of it with /logout route
// Verify with /verification ?

describe("JWT handling", () => {
  const user = {
    username: "jwt_tester",
    email: "jwt_tester@tester.com",
    password: "576334ddS",
  };
  beforeAll(async () => {
    await prisma.user.create({ data: { user } });
  });

  test("JWT is assigned on login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send(user)
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(200);

    expect(typeof res.body.jwt).toBe("String");
    expect(res.body.jwt.length).toBeGreaterThan(0);
  });
  test("JWT invalid after logout", () => {});

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
  });
});

// To user
describe("JWT Token", () => {
  test("JWT invalid after email update", () => {});
  test("JWT invalid after password update", () => {});
  test("JWT invalid after username update", () => {});
});
