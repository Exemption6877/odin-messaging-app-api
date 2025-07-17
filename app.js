const express = require("express");

const app = express();
app.use(express.json());

require("dotenv").config();

app.get("/", (req, res) => {
  res.json({ name: "main route" });
});

const authRouter = require("./routers/authRouter");

app.use("/auth", authRouter);

module.exports = app;
