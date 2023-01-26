const passport = require("passport");
const User = require("../models/User");
const S3 = require("../middleware/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

// GET ( Google authentification )
exports.google = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// GET ( Github authentification )
exports.github = passport.authenticate("github");

// GET ( Facebook authentification )
exports.facebook = passport.authenticate("facebook", { scope: ["email"] });

// POST ( Register )
exports.register = async (req, res) => {
  try {
    if (req.file) {
      let photo = await S3.uploadFile(req.file);
      req.body.photo = photo.Location;
      await unlinkFile(req.file.path);
    }
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// GET ( Logout )
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json(err.message);
    res.clearCookie("connect.sid");
    res.status(204).send();
  });
};

// GET ( récuprer l'utilisateur connecté )
exports.getMe = async (req, res) => {
  try {
    req.user.password = undefined;
    res.json(req.user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
