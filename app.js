const express = require("express");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const passportSetup = require("./config/google-passport");
const LocalpassportSetup = require("./config/local-passport");
const keys = require("./config/keys");

//Routes
const GoogleOAuth = require("./routes/google-auth");
const ProfileRoutes = require("./routes/profile-routes");
const NormalLogin = require("./routes/normal-auth");
const ProductRoutes = require("./routes/product-routes");
const ProductCartRoutes = require("./routes/product-cart");
const OrderRoutes = require("./routes/order-routes");
const AddressRoutes = require("./routes/address-routes");

//DB config
require("./config/db");

const app = express();

// set view engine
app.set("view engine", "ejs");

//static folder
app.use(express.static(__dirname + "/"));

// set up session cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Initialise routes
app.use("/auth", GoogleOAuth);
app.use("/profile", ProfileRoutes);
app.use("/users", NormalLogin);
app.use("/product", ProductRoutes);
app.use("/productcart", ProductCartRoutes);
app.use("/orders", OrderRoutes);
app.use("/address", AddressRoutes);

//Enable cors
app.use(cors());

app.get("/", (req, res) => {
  res.render("home", { req: req });
});

const port = 3000;

//start server
app.listen(port, () => console.log(`Server started on port ${port}`));
