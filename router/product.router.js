const express = require("express");
const multer = require("multer");
const Authentication = require("../middleware/Author.middleware");
const upload = multer({ dest: "./public/img/product" });

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

// POST : [http://localhost:3000/product]
product.post("/", upload.single("uploaded_img"), Authentication, createProduct);

// POST : [http://localhost:3000/product]
product.get("/", getAllProduct);

// get : http://localhost:3000/product/recycling-bin/
product.get("/bin", getAllDeletSoftProduct);

// get : http://localhost:3000/product/:slug
product.get("/:slug", getDetailProduct);

// pacth : http://localhost:3000/product/:slug
product.patch("/:slug", upload.single("uploaded_img"), UpdateProduct);

// delete : http://localhost:3000/product/:slug
product.delete("/:slug", deleteSoftProduct);

// delete : http://localhost:3000/product/:slug
product.delete("/recycling-bin/:slug", deleteForeverProduct);

// patch : http://localhost:3000/restore/:slug
product.patch("/restore/:slug", RestoreProduct);

module.exports = product;
