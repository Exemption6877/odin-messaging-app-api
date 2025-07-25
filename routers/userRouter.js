const { Router } = require("express");
const passport = require("passport");
const { body } = require("express-validator");

const userRouter = Router();
const verifyToken = require("../middleware/verifyToken");

const userController = require("../controllers/userController");

// i will do profile search here

// Current plan

// postProfile will be called after first login
const profileRouter = require("./profileRouter");

userRouter.use("/:userId/profile", profileRouter);

// Better to do separate route, as  message/to= id
// userRouter.use("/:userId/message", messageRouter);

// group will be most likely separate route
// userRouter.use("/:userId/group", groupRouter)

userRouter.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  verifyToken,
  userController.getUser
);

userRouter.put(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  verifyToken,
  [
    body("email").optional({ checkFalsy: true }).isEmail(),
    body("username")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 3, max: 32 }),
    body("password")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 8, max: 24 }),
    body("confirmPassword").exists({ checkFalsy: true }),
  ],
  userController.updateUser
);

module.exports = userRouter;
