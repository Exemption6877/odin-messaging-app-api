const express = require("express");

const app = express();
app.use(express.json());

require("dotenv").config();

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const db = require("./prisma/queries");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function verify(email, password, cb) {
      try {
        const user = await db.user.findByEmail(email);

        if (!user) return cb(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return cb(null, false, {
            message: "Incorrect password.",
          });
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

app.get("/", (req, res) => {
  res.json({ name: "main route" });
});

const authRouter = require("./routers/authRouter");

app.use("/auth", authRouter);

module.exports = app;
