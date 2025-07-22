const { Router } = require("express");
const { body } = require("express-validator");

const authRouter = Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const issueToken = require("../middleware/issueJWT");

authRouter.post(
  "/signup",
  [
    body("email").isEmail(),
    body("username").trim().isLength({ min: 3, max: 32 }),
    body("password").trim().isLength({ min: 8, max: 24 }),
  ],
  authController.signUp
);

authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(400).json({ error: "Incorrect credentials" });
    }

    if (!user) {
      return res.status(400).json({ error: "Incorrect credentials" });
    }

    const token = issueToken(user);

    return res.status(200).json({ message: "Login successful", token });
  })(req, res, next);
});

module.exports = authRouter;
