const prisma = require("../prisma");

async function findById(userId) {
  try {
    return await prisma.profile.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: {
            username: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });
  } catch (err) {
    throw new Error(`DB: could not find profile. Error:${err}`);
  }
}

async function createProfile(profile) {
  try {
    return await prisma.profile.create({
      data: {
        desc: profile.desc,
        status_msg: profile.status_msg,
        pfp: profile.pfp,
        userId: profile.userId,
      },
    });
  } catch (err) {
    throw new Error(`DB: could not create profile. Error:${err}`);
  }
}

async function updateProfile(profile) {
  try {
    return await prisma.profile.update({
      where: { userId: profile.userId },
      data: {
        desc: profile.desc,
        status_msg: profile.status_msg,
        pfp: profile.pfp,
      },
    });
  } catch (err) {
    throw new Error(`DB: could not update profile. Error:${err}`);
  }
}

async function partialFind(username) {
  try {
    return await prisma.profile.findMany({
      where: {
        user: {
          username: {
            contains: username,
            mode: "insensitive",
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
            status: true,
          },
        },
      },
    });
  } catch (err) {
    throw new Error(`DB: could not fetch profiles. Error:${err}`);
  }
}

async function getAll() {
  try {
    return await prisma.profile.findMany({
      include: {
        user: {
          select: {
            username: true,
            status: true,
          },
        },
      },
    });
  } catch (err) {
    throw new Error(`DB: could not fetch profiles. Error:${err}`);
  }
}

module.exports = {
  findById,
  createProfile,
  updateProfile,
  partialFind,
  getAll,
};
