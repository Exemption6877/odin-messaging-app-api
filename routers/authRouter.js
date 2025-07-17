const { Router } = require("express");

const authRouter = Router();
const authController = require("../controllers/authController");

authRouter.post("/signup", authController.signUp);
authRouter.post("/login", authController.logIn);

module.exports = authRouter;
