const { Router } = require("express");
const { body } = require("express-validator");

const authRouter = Router();
const authController = require("../controllers/authController");

authRouter.post(
  "/signup",
  [
    body("email").isEmail(),
    body("username").trim().isLength({ min: 3, max: 32 }),
    body("password").trim().isLength({ min: 8, max: 24 }),
  ],
  authController.signUp
);
authRouter.post("/login", authController.logIn);

module.exports = authRouter;
