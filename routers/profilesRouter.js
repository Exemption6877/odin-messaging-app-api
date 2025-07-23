const { Router } = require("express");

const profileController = require("../controllers/profileController");

const profilesRouter = Router();

profilesRouter.get("/", profileController.partialFind);

module.exports = profilesRouter;
