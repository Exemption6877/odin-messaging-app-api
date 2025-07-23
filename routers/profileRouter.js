const { Router } = require("express");
const passport = require("passport");

const profileRouter = Router({ mergeParams: true });
const profileController = require("../controllers/profileController");

// need GET ALL
// need GET BY PARTIAL MATCH

// Do query

profileRouter.get("/", profileController.getProfile);
profileRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileController.postProfile
);

profileRouter.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileController.updateProfile
);

module.exports = profileRouter;
