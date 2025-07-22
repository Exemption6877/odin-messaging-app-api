const { Router } = require("express");
const passport = require("passport");
const { body } = require("express-validator");

const userRouter = Router();
const verifyToken = require("../middleware/verifyToken");

const userController = require("../controllers/userController");

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
