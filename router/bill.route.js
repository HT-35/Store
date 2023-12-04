// const express = require("express");
// const billRoute = express.Router();

const express = require("express");
const billRoute = express.Router();

const { createBill } = require("../controller/payment.controller");
const Authentication = require("../middleware/Author.middleware");

billRoute.post("/", Authentication, createBill);

module.exports = billRoute;
