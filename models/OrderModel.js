var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var OrderSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "product"
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: "address"
  },
  price: {
    type: Number
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

var Order = mongoose.model("order", OrderSchema);

module.exports = Order;
