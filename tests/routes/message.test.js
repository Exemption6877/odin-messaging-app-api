const app = require("../../app");
const prisma = require("../../prisma/prisma");
const request = require("supertest");

let API_URL;

describe("Methods", () => {
  const user1 = {
    username: "messagemethodtester1",
    email: "messagemethodtester1@mail.com",
    password: "messagetest1",
  };

  const user2 = {
    username: "messagemethodtester2",
    email: "messagemethodtester2@mail.com",
    password: "messagetest2",
  };

  let user1info, user2info;

  beforeAll(async () => {
    const user1signup = await request(app)
      .post("/auth/signup")
      .send(user1)
      .set("Accept", "application/json");

    const user1login = await request(app)
      .post("/auth/login")
      .send(user1)
      .set("Accept", "application/json");

    user1info = {
      id: user1signup.body.id,
      token: user1login.body.token,
    };

    const user2signup = await request(app)
      .post("/auth/signup")
      .send(user2)
      .set("Accept", "application/json");

    const user2login = await request(app)
      .post("/auth/login")
      .send(user2)
      .set("Accept", "application/json");

    user2info = {
      id: user2signup.body.id,
      token: user2login.body.token,
    };
    API_URL = `/message/${user2info.id}`;
  });

  test("POST", async () => {
    const res = await request(app)
      .post(API_URL)
      .set("Authorization", user1info.token)
      .set("Accept", "application/json")
      .send({ text: "posted message", image: "some image" })
      .expect(201);

    expect(res.body.text).toBe("posted message");
    expect(res.body.image).toBe("some image");
    expect(res.body.id).toBe(user.id);
    expect(res.body.authorId).toBe(user1info.id);
  });

  test("GET", async () => {
    const res = await request(app)
      .get(API_URL)
      .set("Authorization", user1info.token)
      .set("Accept", "application/json")
      .expect(200);

    expect(res.body.text).toBe("posted message");
    expect(res.body.image).toBe("some image");
    expect(res.body.id).toBe(user.id);
    expect(res.body.authorId).toBe(user1info.id);
  });

  test("PUT", async () => {
    const res = await request(app)
      .put(API_URL)
      .set("Authorization", user1info.token)
      .set("Accept", "application/json")
      .send({ text: "updated message", image: "updated image" })
      .expect(201);

    expect(res.body.text).toBe("updated message");
    expect(res.body.image).toBe("updated image");
    expect(res.body.id).toBe(user.id);
    expect(res.body.authorId).toBe(user1info.id);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user1.email } });
    await prisma.user.deleteMany({ where: { email: user2.email } });
  });
});

describe("Multiple messages testing", () => {
  const user1 = {
    username: "messagetester1",
    email: "messagetester1@mail.com",
    password: "messagetest1",
  };

  const user2 = {
    username: "messagetester2",
    email: "messagetester2@mail.com",
    password: "messagetest2",
  };

  let API_URL_TO_FIRST, API_URL_TO_SECOND;

  beforeAll(async () => {
    // create 2 users and 3 messages for each
    const user1signup = await request(app)
      .post("/auth/signup")
      .send(user1)
      .set("Accept", "application/json");

    const user1login = await request(app)
      .post("/auth/signup")
      .send(user1)
      .set("Accept", "application/json");

    const user1info = {
      id: user1signup.body.id,
      token: user1login.body.token,
    };

    const user2signup = await request(app)
      .post("/auth/signup")
      .send(user2)
      .set("Accept", "application/json");

    const user2login = await request(app)
      .post("/auth/signup")
      .send(user2)
      .set("Accept", "application/json");

    const user2info = {
      id: user2signup.body.id,
      token: user2login.body.token,
    };

    user1msg = [
      {
        text: "user 1 message 1",
        image: "",
      },
      {
        text: "user 1 message 2",
        image: "user 1 image 2",
      },
      { text: "user 1 message 3", image: "" },
    ];

    user2msg = [
      {
        text: "user 2 message 1",
        image: "",
      },
      {
        text: "user 2 message 2",
        image: "",
      },
      {
        text: "user 2 message 3",
        image: "user 2 image 3",
      },
    ];

    API_URL_TO_FIRST = `/messages/${user1info.id}`;
    API_URL_TO_SECOND = `/messages/${user2info.id}`;
  });

  test("POST multiple messages for each user", async () => {
    // Simulate messaging 1-2-1-2-2-1

    //user 1 msg 1
    const u1msg1 = await request(app)
      .post(API_URL_TO_SECOND)
      .send(user1msg[0])
      .set("Authorization", user1info.token)
      .set("Accept", "application/json")
      .expect(201);

    expect(u1msg1.body.text).toBe("user 1 message 1");

    //user 2 msg 1
    const u2msg1 = await request(app)
      .post(API_URL_TO_FIRST)
      .send(user2msg[0])
      .set("Authorization", user2info.token)
      .set("Accept", "application/json")
      .expect(201);
    expect(u2msg1.body.text).toBe("user 2 message 1");

    //user 1 msg 2
    const u1msg2 = await request(app)
      .post(API_URL_TO_SECOND)
      .send(user1msg[1])
      .set("Authorization", user1info.token)
      .set("Accept", "application/json")
      .expect(201);

    expect(u1msg2.body.text).toBe("user 1 message 2");
    expect(u1msg2.body.image).toBe("user 1 image 2");

    //user 2 msg 2
    const u2msg2 = await request(app)
      .post(API_URL_TO_FIRST)
      .send(user2msg[1])
      .set("Authorization", user2info.token)
      .set("Accept", "application/json")
      .expect(201);

    expect(u2msg2.body.text).toBe("user 2 message 2");

    //user 1 msg 3
    const u1msg3 = await request(app)
      .post(API_URL_TO_SECOND)
      .send(user1msg[2])
      .set("Authorization", user1info.token)
      .set("Accept", "application/json")
      .expect(201);

    expect(u1msg3.body.text).toBe("user 1 message 3");
    //user 2 msg 3
    const u2msg3 = await request(app)
      .post(API_URL_TO_FIRST)
      .send(user2msg[2])
      .set("Authorization", user2info.token)
      .set("Accept", "application/json")
      .expect(201);

    expect(u2msg3.body.text).toBe("user 2 message 3");
    expect(u2msg3.body.image).toBe("user 2 image 3");
  });
  test("GET", async () => {
    // get in order 1-2-1-2-2-1

    const res = await request(app)
      .get(API_URL_TO_SECOND)
      .set("Authorization", user1info.token)
      .set("Accept", "application/json")
      .expect(200);

    expect(res.body[0].text).toBe("user 1 message 1");
    expect(res.body[1].text).toBe("user 2 message 1");
    expect(res.body[2].text).toBe("user 1 message 2");
    expect(res.body[3].text).toBe("user 2 message 2");
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user1.email } });
    await prisma.user.deleteMany({ where: { email: user2.email } });
  });
});

describe("Unauthorized requests", () => {
  test("POST", async () => {
    await request(app)
      .post(API_URL)
      .set("Accept", "application/json")
      .send({ text: "some message", image: "some image" })
      .expect(401);
  });

  test("GET", async () => {
    await request(app)
      .get(API_URL)
      .set("Accept", "application/json")
      .expect(401);
  });

  test("PUT", async () => {
    await request(app)
      .put(API_URL)
      .set("Accept", "application/json")
      .send({ text: "updated message", image: "updated image" })
      .expect(401);
  });
});
