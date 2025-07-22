const prisma = require("../prisma");

// Add two services to find user with either email or username for signup

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

async function findById(id) {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (err) {
    throw new Error(`DB: could not find user by id. Error:${err}`);
  }
}

async function findByEmail(email) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (err) {
    throw new Error(`DB: could not find user by email. Error:${err}`);
  }
}

async function findByUsername(username) {
  try {
    return await prisma.user.findUnique({ where: { username } });
  } catch (err) {
    throw new Error(`DB: could not find user by username. Error:${err}`);
  }
}

async function updateUser(user) {
  try {
    return await prisma.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
  } catch (err) {
    throw new Error(`DB: could not update user. Error:${err}`);
  }
}

module.exports = { signUp, findById, findByEmail, findByUsername, updateUser };
