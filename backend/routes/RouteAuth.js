const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("../middleware/multer-config");
const authController = require("../controllers/AuthController");
const passportAuth = require("../middleware/passport-auth");

router.get("/google", authController.google);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: process.env.CLIENT_URL + "/login",
  })
);

router.get("/github", authController.github);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: process.env.CLIENT_URL + "/login",
    successRedirect: process.env.CLIENT_URL,
  })
);

router.get("/facebook", authController.facebook);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: process.env.CLIENT_URL + "/login",
    successRedirect: process.env.CLIENT_URL,
  })
);

router.post("/register", multer, authController.register);

router.post("/login", passport.authenticate("local"), authController.getMe);

router.get("/getMe", authController.getMe);

router.get("/logout", passportAuth, authController.logout);

module.exports = router;
