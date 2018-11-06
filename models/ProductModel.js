var mongoose = require("mongoose");

var ProductSchema = mongoose.Schema({
  title: {
    type: String
  },
  img: {
    type: String
  },
  desc: {
    type: String
  },
  category: {
    type: String
  },
  price: {
    type: Number
  },
  date: {
    type: String,
    default: Date.now
  }
});

var Product = mongoose.model("product", ProductSchema);

module.exports = Product;
