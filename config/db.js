const mongoose = require("mongoose");

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose connect
mongoose
  .connect(
    "mongodb://pavanmalisetti:satyanarayana@ds213759.mlab.com:13759/nn-oauth-test"
  )
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log(err));
