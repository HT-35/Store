const express = require("express");
const login = express.Router();

const loginController = require("../controller/login.controller");

login.post("/", loginController);

module.exports = login;
