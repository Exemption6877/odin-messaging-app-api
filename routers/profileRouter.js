const { Router } = require("express");
const passport = require("passport");

const profileRouter = Router({ mergeParams: true });
const profileController = require("../controllers/profileController");

profileRouter.get("/", profileController.getProfile);
profileRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileController.postProfile
);

module.exports = profileRouter;
