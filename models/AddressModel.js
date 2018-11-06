var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var AddressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "normaluser"
  },
  address: {
    type: String
  },
  pincode: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  date: {
    type: String,
    default: Date.now
  }
});

var Address = mongoose.model("address", AddressSchema);

module.exports = Address;
