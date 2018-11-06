const express = require("express");
const router = express.Router();
const passport = require("passport");

//checks if user is logged in or not
const authCheck = (req, res, next) => {
  if (req.user) {
    res.redirect("/");
  } else {
    next();
  }
};

// auth login
router.get("/login", authCheck, (req, res) => {
  res.render("login", { user: req.user, req: req });
});

// auth logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

// auth with google+
router.get(
  "/google",
  authCheck,
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

// callback route for google to redirect to
// handover control to passport to use code to grab profile info
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // res.send(req.user);
  res.redirect("/");
});

module.exports = router;
