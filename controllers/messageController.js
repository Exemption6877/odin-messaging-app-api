const db = require("../prisma/queries");

async function getMessages(req, res) {
  try {
    const senderId = Number(req.user.id);
    if (!senderId) return res.status(403).json({ error: "Not logged in" });

    const recipientId = Number(req.params.recipientId);
    if (!recipientId) return res.status(404).json({ error: "User not found" });

    const messages = await db.message.getMessages(senderId, recipientId);

    return res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Could not find messages" });
  }
}

async function postMessage(req, res) {
  try {
    const senderId = Number(req.user.id);
    if (!senderId) return res.status(403).json({ error: "Not logged in" });

    const recipientId = Number(req.params.recipientId);
    if (!recipientId) return res.status(404).json({ error: "User not found" });

    const { text, image } = req.body;

    const messageData = {
      text: text,
      image: image,
      receiverId: recipientId,
      authorId: senderId,
    };
    const message = await db.message.createMessage(messageData);

    return res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: "Could not send message" });
  }
}

async function editMessage(req, res) {
  try {
    const senderId = Number(req.user.id);
    if (!senderId) return res.status(403).json({ error: "Not logged in" });

    const messageId = Number(req.params.messageId);
    const prevMessage = await db.message.getMessageById(messageId);

    if (!prevMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    const { text } = req.body;
    const messageData = {
      id: messageId,
      text: text,
      image: prevMessage.image,
    };

    const editedMessage = await db.message.editMessage(messageData);

    return res.status(201).json(editedMessage);
  } catch (err) {
    res.status(500).json({ error: "Could not edit message" });
  }
}

async function getSpecificMessage(req, res) {
  try {
    const messageId = Number(req.params.messageId);
    const message = await db.message.getMessageById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: "Could not get message" });
  }
}

module.exports = { getMessages, postMessage, editMessage, getSpecificMessage };
