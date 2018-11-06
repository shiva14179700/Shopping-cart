const router = require("express").Router();

//address model
const Address = require("../models/AddressModel");

//Checking if the user is logged in or not
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/users/login");
  } else {
    next();
  }
};

//@route GET /address
//@description get addresses
//@access Private
router.get("/", authCheck, (req, res) => {
  Address.find({ user: req.user })
    .populate("user", ["name", "email"])
    .then(addresses => {
      if (addresses) {
        res.render("address", {
          addresses: addresses,
          productid: req.query.id,
          from: req.query.from,
          req: req
        });
      }
    });
});

//@route POST /address
//@description add address to the buying products
//@access Private
router.post("/", authCheck, (req, res) => {
  const newAddress = new Address({
    user: req.user.id,
    address: req.body.address,
    pincode: req.body.pincode,
    city: req.body.city,
    state: req.body.state
  });
  newAddress
    .save()
    .then(address => res.json(address))
    .catch(err => res.json(err));
});

module.exports = router;
