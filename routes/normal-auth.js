const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");

//Usermodel
const User = require("../models/normaluser");

//validations
const validateRegisterInput = require("../validations/register");

//checks if user is logged in or not
const authCheck = (req, res, next) => {
  if (req.user) {
    res.redirect("/");
  } else {
    next();
  }
};

//@route GET /users/register
//@description renders register page
//@access Public
router.get("/register", authCheck, (req, res) => {
  res.render("register", { user: req.user, req: req });
});

//@route POST /users/validatenewuser
//@description checks if user with same email present or not
//@access Public
router.post("/validatenewuser", (req, res) => {
  let errors = {};
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json({ errors });
    } else {
      errors.email = null;
      return res.json({ errors });
    }
  });
});

router.post("/validateuser", (req, res) => {
  let errors = {};
  //Find User by email
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      errors.email = "Email doesnot exists";
      return res.status(400).json({ errors });
    }

    const password = req.body.password;
    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        errors.password = null;
        return res.json({ errors });
      } else {
        errors.password = "Password Incorrect";
        return res.json({ errors });
      }
    });
  });
});

//@route POST /users/register
//@description register user
//@access Public
router.post("/register", authCheck, (req, res) => {
  let errors = {};
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json({ errors });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route GET /users/login
//@description renders login page
//@access Public
router.get("/login", authCheck, (req, res) => {
  res.render("login", { user: req.user, req: req });
});

//@route POST /users/login
//@description login user
//@access Public
router.post(
  "/login",
  authCheck,
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/users/login"
  }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// normal logout @GET
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
