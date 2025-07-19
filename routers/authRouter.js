const { Router } = require("express");
const { body } = require("express-validator");

const authRouter = Router();
const authController = require("../controllers/authController");
const passport = require("passport");

authRouter.post(
  "/signup",
  [
    body("email").isEmail(),
    body("username").trim().isLength({ min: 3, max: 32 }),
    body("password").trim().isLength({ min: 8, max: 24 }),
  ],
  authController.signUp
);
// authRouter.post("/login", authController.logIn);
authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(400).json({ error: "Incorrect credentials" });
    }

    if (!user) {
      return res.status(400).json({ error: "Incorrect credentials" });
    }

    return res.status(200).json({ message: "Login successful" });
  })(req, res, next);
});

module.exports = authRouter;
