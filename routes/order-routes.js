const router = require("express").Router();

//model
const Order = require("../models/OrderModel");
const ProductCart = require("../models/ProductCartModel");
const Product = require("../models/ProductModel");

// router.get("/", (req, res) => {
//   res.send("orders");
// });

//Checking if the user is logged in or not
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/users/login");
  } else {
    next();
  }
};

//@route GET /orders/addorder
//@description add order
//@access Private
router.get("/addorder", authCheck, (req, res) => {
  let errors = {};
  console.log(req.query.from);
  if (req.query.from == "cart") {
    ProductCart.find({ user: req.user.id })
      .populate("product", ["title", "desc", "category", "price", "img"])
      .then(products => {
        if (products) {
          products.map(product => {
            const newOrder = new Order({
              product: product.product,
              address: req.query.addressid,
              price: product.product.price,
              user: req.user.id
            });
            newOrder
              .save()
              .then(order => {
                product.remove().then(() => console.log("removedd"));
              })
              .catch(err => res.json(err));
          });
          res.redirect("/orders");
        } else {
          errors.order = "There are no products in the cart";
          return res.json(errors);
        }
      });
  } else {
    Product.findById(req.query.id)
      .then(product => {
        if (product) {
          const newOrder = new Order({
            product: product.id,
            address: req.query.addressid,
            price: product.price,
            user: req.user.id
          });
          newOrder
            .save()
            .then(order => res.redirect("/orders"))
            .catch(err => res.json(err));
        } else {
          errors.order = "There are no products with this id";
        }
      })
      .catch(err => res.json(err));
  }
});

router.get("/", authCheck, (req, res) => {
  Order.find({ user: req.user })
    .populate("product", ["title", "desc", "category", "price", "img"])
    .populate("address", ["address", "pincode", "city", "state"])
    .then(orders => {
      if (orders) {
        res.render("orders", { orders: orders, req: req });
      }
    });
});

//@route DELETE /orders/delete-order/:id
//@description delete product from orders page
//@access Private
router.get("/delete-order/:id", authCheck, (req, res) => {
  Order.findById(req.params.id)
    .then(order => {
      if (order.user.toString() !== req.user.id) {
        return res.status(401).json({ notauthorized: "Not Autthorized!" });
      }

      //Delete order from cart
      order.remove().then(() => res.redirect("/orders"));
    })
    .catch(err => res.status(404).json({ ordernotfound: "No order Found!" }));
});

module.exports = router;
