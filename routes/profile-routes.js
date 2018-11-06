const router = require("express").Router();

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/users/login");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  res.render("product", { req: req });
});

router.get("/address", authCheck, (req, res) => {
  res.render("address", { req: req });
});

module.exports = router;
