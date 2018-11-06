var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ProductCartSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "product"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "normaluser"
  },
  date: {
    type: String,
    default: Date.now
  }
});

var ProductCart = mongoose.model("productcart", ProductCartSchema);

module.exports = ProductCart;
