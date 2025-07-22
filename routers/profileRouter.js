const { Router } = require("express");

const profileRouter = Router({ mergeParams: true });
const profileController = require("../controllers/profileController");

profileRouter.get("/", profileController.getProfile);

module.exports = profileRouter;
