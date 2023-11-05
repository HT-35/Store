const express = require("express");
const menu = express.Router();

const { getMenu } = require("../controller/menu.controller");

menu.get("/", getMenu);

module.exports = menu;
