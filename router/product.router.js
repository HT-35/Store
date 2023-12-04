const express = require("express");
const multer = require("multer");
const Authentication = require("../middleware/Author.middleware");

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img/product");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg"); //Appending .jpg //Appending extension
  },
});
const upload = multer({ storage: storage });
  
const product = express.Router();

const {
  createProduct,
  getAllProduct,
  getDetailProduct,
  UpdateProduct,
  deleteSoftProduct,
  deleteForeverProduct,
  RestoreProduct,
  getAllDeletSoftProduct,
} = require("../controller/product.controller");

const {
  createCommentPro,
  GetCommentProduct,
} = require("../controller/commentProduct.controller");

// POST : [http://localhost:3000/product]
product.post("/", upload.single("uploaded_img"), Authentication, createProduct);

// POST : [http://localhost:3000/product]
product.get("/", getAllProduct);

// get : http://localhost:3000/product/recycling-bin/
product.get("/bin", getAllDeletSoftProduct);

// get comment: http://localhost:3000/product/comment
product.get("/comment", GetCommentProduct);

// get : http://localhost:3000/product/:slug
product.get("/:slug", Authentication, getDetailProduct);

// pacth : http://localhost:3000/product/:slug
product.patch("/:slug", upload.single("uploaded_img"), UpdateProduct);

// delete : http://localhost:3000/product/:slug
product.delete("/:slug", deleteSoftProduct);

// delete : http://localhost:3000/product/:slug
product.delete("/recycling-bin/:slug", deleteForeverProduct);

// patch : http://localhost:3000/restore/:slug
product.patch("/restore/:slug", RestoreProduct);

// post : http://localhost:3000/product/comment
product.post("/comment", createCommentPro);

module.exports = product;
