const prisma = require("../prisma");

async function findById(id) {
  try {
    return await prisma.profile.findUnique({
      where: { id },
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

module.exports = { findById };
