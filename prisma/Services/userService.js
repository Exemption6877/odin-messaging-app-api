const prisma = require("../prisma");

async function signUp(user) {
  try {
    return await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
  } catch (err) {
    throw new Error(`DB: could not create user. Error:${err}`);
  }
}

async function logIn(user) {
  try {
    return await prisma.user.findUnique({ where: { email: user.email } });
  } catch (err) {
    throw new Error(`DB: could not find user. Error:${err}`);
  }
}

module.exports = { signUp, logIn };
