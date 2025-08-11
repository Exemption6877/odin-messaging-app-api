const express = require("express");

const app = express();
app.use(express.json());
const cors = require("cors");

require("dotenv").config();

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const db = require("./prisma/queries");

app.use(cors());

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

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY,
    },
    async (jwt_payload, done) => {
      try {
        const user = await db.user.findById(jwt_payload.id);

        if (!user) {
          return done(null, false);
        }

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

// Routes

app.get("/", (req, res) => {
  res.json({ name: "main route" });
});

const authRouter = require("./routers/authRouter");
app.use("/auth", authRouter);

const userRouter = require("./routers/userRouter");
app.use("/user", userRouter);

const profilesRouter = require("./routers/profilesRouter");
app.use("/profiles", profilesRouter);

const messageRouter = require("./routers/messagesRouter");
app.use("/message", messageRouter);

module.exports = app;
