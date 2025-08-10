const prisma = require("../prisma");

async function createMessage(message) {
  try {
    return await prisma.message.create({
      data: {
        text: message.text,
        image: message.image,
        authorId: message.authorId,
        receiverId: message.receiverId,
        groupId: message.groupId,
      },
    });
  } catch (err) {
    throw new Error(`DB: could not create message. Error:${err}`);
  }
}

async function getMessages(firstUser, secondUser) {
  try {
    return await prisma.message.findMany({
      where: {
        OR: [
          {
            authorId: firstUser,
            receiverId: secondUser,
          },
          {
            authorId: secondUser,
            receiverId: firstUser,
          },
        ],
      },

      orderBy: { createdAt: "asc" },
    });
  } catch (err) {
    throw new Error(`DB: could not fetch messages. Error:${err}`);
  }
}

async function editMessage(message) {
  try {
    return await prisma.message.update({
      where: { id: message.id },
      data: {
        text: message.text,
        image: message.image,
      },
    });
  } catch (err) {
    throw new Error(`DB: could not edit message. Error:${err}`);
  }
}

async function getMessageById(id) {
  try {
    return await prisma.message.findUnique({ where: { id } });
  } catch (err) {
    throw new Error(`DB: could not fetch message. Error:${err}`);
  }
}

async function getAllUserMessages(userId) {
  try {
    return await prisma.message.findMany({
      where: {
        OR: [
          {
            authorId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
    });
  } catch (err) {
    throw new Error(`DB: could not fetch messages. Error:${err}`);
  }
}

module.exports = {
  createMessage,
  getMessages,
  editMessage,
  getMessageById,
  getAllUserMessages,
};
