const express = require("express");

const user = express.Router();
const multer = require("multer");

const upload = multer({ dest: "./public/img/product" });

const validateUser = require("../middleware/validateUser.middleware");

const { createUser } = require("../controller/user.controller");

// Post http://localhost:3000/user
user.post("/", upload.single("uploaded_img"), validateUser, createUser);

module.exports = user;
