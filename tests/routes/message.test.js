const app = require("../../app");
const prisma = require("../../prisma/prisma");
const request = require("supertest");

describe("Methods", () => {
  let user1info, user2info;
  let messageId;
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
    API_URL = `/message/user/${user2info.id}`;
  });

  test("POST", async () => {
    const res = await request(app)
      .post(`/message/user/${user2info.id}`)
      .set("Authorization", user1info.token)
      .set("Accept", "application/json")
      .send({ text: "posted message", image: "some image" })
      .expect(200);

    expect(res.body.text).toBe("posted message");
    expect(res.body.image).toBe("some image");
    expect(res.body.authorId).toBe(user1info.id);
    console.log("Token:", user1info.token);

    messageId = res.body.id;
  });

  test("GET", async () => {
    const res = await request(app)
      .get(`/message/${messageId}`)
      .set("Authorization", user1info.token)
      .set("Accept", "application/json")
      .expect(200);

    expect(res.body.text).toBe("posted message");
    expect(res.body.image).toBe("some image");
    expect(res.body.authorId).toBe(user1info.id);
  });

  test("PUT", async () => {
    const res = await request(app)
      .put(`/message/${messageId}`)
      .set("Authorization", user1info.token)
      .set("Accept", "application/json")
      .send({ text: "updated message", image: "updated image" })
      .expect(201);

    expect(res.body.text).toBe("updated message");
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
  let user3info, user4info;

  beforeAll(async () => {
    // create 2 users and 3 messages for each
    const user3signup = await request(app)
      .post("/auth/signup")
      .send(user1)
      .set("Accept", "application/json");

    const user3login = await request(app)
      .post("/auth/login")
      .send(user1)
      .set("Accept", "application/json");

    user3info = {
      id: user3signup.body.id,
      token: user3login.body.token,
    };

    const user4signup = await request(app)
      .post("/auth/signup")
      .send(user2)
      .set("Accept", "application/json");

    const user4login = await request(app)
      .post("/auth/login")
      .send(user2)
      .set("Accept", "application/json");

    user4info = {
      id: user4signup.body.id,
      token: user4login.body.token,
    };

    user3msg = [
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

    user4msg = [
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

    API_URL_TO_FIRST = `/message/user/${user3info.id}`;
    API_URL_TO_SECOND = `/message/user/${user4info.id}`;
  });

  test("POST multiple messages for each user", async () => {
    // Simulate messaging 1-2-1-2-2-1

    //user 1 msg 1
    const u3msg1 = await request(app)
      .post(API_URL_TO_SECOND)
      .send(user3msg[0])
      .set("Authorization", user3info.token)
      .set("Accept", "application/json")
      .expect(200);

    expect(u3msg1.body.text).toBe("user 1 message 1");

    //user 2 msg 1
    const u4msg1 = await request(app)
      .post(API_URL_TO_FIRST)
      .send(user4msg[0])
      .set("Authorization", user4info.token)
      .set("Accept", "application/json")
      .expect(200);
    expect(u4msg1.body.text).toBe("user 2 message 1");

    //user 1 msg 2
    const u3msg2 = await request(app)
      .post(API_URL_TO_SECOND)
      .send(user3msg[1])
      .set("Authorization", user3info.token)
      .set("Accept", "application/json")
      .expect(200);

    expect(u3msg2.body.text).toBe("user 1 message 2");
    expect(u3msg2.body.image).toBe("user 1 image 2");

    //user 2 msg 2
    const u4msg2 = await request(app)
      .post(API_URL_TO_FIRST)
      .send(user4msg[1])
      .set("Authorization", user4info.token)
      .set("Accept", "application/json")
      .expect(200);

    expect(u4msg2.body.text).toBe("user 2 message 2");

    //user 1 msg 3
    const u3msg3 = await request(app)
      .post(API_URL_TO_SECOND)
      .send(user3msg[2])
      .set("Authorization", user3info.token)
      .set("Accept", "application/json")
      .expect(200);

    expect(u3msg3.body.text).toBe("user 1 message 3");
    //user 2 msg 3
    const u4msg3 = await request(app)
      .post(API_URL_TO_FIRST)
      .send(user4msg[2])
      .set("Authorization", user4info.token)
      .set("Accept", "application/json")
      .expect(200);

    expect(u4msg3.body.text).toBe("user 2 message 3");
    expect(u4msg3.body.image).toBe("user 2 image 3");
  });
  test("GET", async () => {
    // get in order 1-2-1-2-2-1

    const res = await request(app)
      .get(`/message/user/${user4info.id}`)
      .set("Authorization", user3info.token)
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
      .post(`/message/2`)
      .set("Accept", "application/json")
      .send({ text: "some message", image: "some image" })
      .expect(404);
  });

  test("GET", async () => {
    await request(app)
      .get(`/message/user/2`)
      .set("Accept", "application/json")
      .expect(401);
  });

  test("PUT", async () => {
    await request(app)
      .put(`/message/user/2`)
      .set("Accept", "application/json")
      .send({ text: "updated message", image: "updated image" })
      .expect(404);
  });
});
