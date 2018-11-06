const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//Usermodel
const User = require("../models/normaluser");

passport.use(
  new LocalStrategy(function(username, password, done) {
    //Find User by email
    User.findOne({ email: username }).then(user => {
      if (!user) {
        return done(null, false);
      }

      //check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //User Matched
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  })
);
