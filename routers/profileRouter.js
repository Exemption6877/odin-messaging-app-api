const { Router } = require("express");

const profileRouter = Router();
const profileController = require("../controllers/profileController");

profileRouter.get("/:profileId", profileController.getProfile);

module.exports = profileRouter;
