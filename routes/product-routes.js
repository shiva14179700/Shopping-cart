const router = require("express").Router();
var mongoose = require("mongoose");
var crypto = require("crypto");
var multer = require("multer");
var path = require("path");
var GridFsStorage = require("multer-gridfs-storage");
var Grid = require("gridfs-stream");

//models
const Product = require("../models/ProductModel");

//Mongoose connection
var mongoURI =
  "mongodb://pavanmalisetti:satyanarayana@ds213759.mlab.com:13759/nn-oauth-test";
var conn = mongoose.createConnection(mongoURI);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/users/login");
  } else {
    next();
  }
};

const adminCheck = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.redirect("/");
  }
};

//@route GET /product/addProduct
//@description render add Product Page
//@access Private
router.get("/addProduct", authCheck, adminCheck, (req, res) => {
  res.render("addProduct", { req: req });
});

//Image upload by multer
let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

var storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        var filename = buf.toString("hex") + path.extname(file.originalname);
        var fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
var upload = multer({ storage });

router.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No Files Exist"
      });
    }

    return res.json(files);
  });
});

router.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No File Exist"
      });
    }

    return res.json(file);
  });
});

router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No File Exist"
      });
    }

    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an Image"
      });
    }
  });
});

//@route POST /product/addProduct
//@description add product
//@access Private
router.post(
  "/addProduct",
  authCheck,
  adminCheck,
  upload.single("file"),
  (req, res) => {
    const newProduct = new Product({
      title: req.body.title,
      img: req.file.filename,
      desc: req.body.desc,
      category: req.body.category,
      price: req.body.price
    });
    newProduct
      .save()
      .then(product => res.json(product))
      .catch(err => console.log(err));
  }
);

//@route GET /product
//@description get product by query
//@access Private
router.get("/", authCheck, (req, res) => {
  Product.findOne(req.query)
    .then(product => {
      if (product) {
        Product.find()
          .limit(7)
          .then(products => {
            res.render("product", {
              product: product,
              products: products.filter(e => e.id !== product.id),
              req: req
            });
          });
      }
    })
    .catch(err => res.json(err));
});

//@route GET /product
//@description get product by query
//@access Private
router.get("/all", authCheck, (req, res) => {
  Product.find(req.query)
    .then(products => {
      res.render("products", { products: products, req: req });
    })
    .catch(err => res.json(err));
});

module.exports = router;
