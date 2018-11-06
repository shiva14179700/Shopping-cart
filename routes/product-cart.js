const router = require("express").Router();

//models
const ProductCart = require("../models/ProductCartModel");

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/users/login");
  } else {
    next();
  }
};

//@route GET /productcart/addProduct
//@description add product to productcart
//@access Private
router.get("/addProduct", authCheck, (req, res) => {
  let errors = {};
  ProductCart.findOne(req.query).then(product => {
    if (product) {
      errors.productincart = "This product already exists in cart";
      return res.json({ errors });
    } else {
      const cartproduct = new ProductCart({
        product: req.query.id,
        user: req.user.id
      });

      cartproduct
        .save()
        .then(product => res.redirect("/productcart"))
        .catch(err => res.json(err));
    }
  });
});

//@route GET /productcart
//@description get products in productcart
//@access Private
router.get("/", authCheck, (req, res) => {
  ProductCart.find({ user: req.user })
    .populate("product", ["title", "desc", "category", "price", "img"])
    .then(products => {
      if (products) {
        let cartValue = 0;
        products.map(x => {
          cartValue = cartValue + x.product.price;
          x.product.desc = x.product.desc.substring(0, 110);
          console.log(x.product.desc);
        });
        console.log(products);
        products.cartValue = cartValue;
        res.render("productscart", { products: products, req: req });
      } else {
        res.render("productscart", { products: products, req: req });
      }
    })
    .catch(err => res.json(err));
});

//@route DELETE /productcart/delete/:id
//@description delete product from productcart
//@access Private
router.get("/delete/:id", authCheck, (req, res) => {
  ProductCart.findById(req.params.id)
    .then(product => {
      if (product.user.toString() !== req.user.id) {
        return res.status(401).json({ notauthorized: "Not Autthorized!" });
      }

      //Delete product from cart
      product.remove().then(() => res.redirect("/productcart"));
    })
    .catch(err =>
      res.status(404).json({ productnotfound: "No Product Found!" })
    );
});

module.exports = router;
