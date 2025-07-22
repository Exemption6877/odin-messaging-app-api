const { Router } = require("express");
const passport = require("passport");

const userRouter = Router();
const verifyToken = require("../middleware/verifyToken");

const userController = require("../controllers/userController");

userRouter.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  verifyToken,
  userController.getUser
);

module.exports = userRouter;
