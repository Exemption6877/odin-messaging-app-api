const { Router } = require("express");
const passport = require("passport");

const messageController = require("../controllers/messageController");
const messageRouter = Router();

messageRouter.get(
  "/user/:recipientId",
  passport.authenticate("jwt", { session: false }),
  messageController.getMessages
);

messageRouter.get(
  "/:messageId",
  passport.authenticate("jwt", { session: false }),
  messageController.getSpecificMessage
);

messageRouter.put(
  "/:messageId",
  passport.authenticate("jwt", { session: false }),
  messageController.editMessage
);
messageRouter.post(
  "/user/:recipientId",
  passport.authenticate("jwt", { session: false }),
  messageController.postMessage
);

module.exports = messageRouter;
