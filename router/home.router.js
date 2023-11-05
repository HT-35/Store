const express = require("express");
const home = express.Router();

const { helloPage } = require("../controller/home.controller");

home.get("/", helloPage);



module.exports = home;
