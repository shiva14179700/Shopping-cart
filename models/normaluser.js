var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    default: Date.now
  }
});

var User = mongoose.model("normaluser", UserSchema);

module.exports = User;
