const express = require("express");
const root = express.Router();

const home = require("./home.router");
const product = require("./product.router");
const menu = require("./menu.router");
const user = require("./user.route");
const login = require("./login.router");
const authenGoogle = require("./loginGoogle.router");
const card = require("./card.router");

const billModel = require("./bill.route");

// const authRouter = require("./authGoogle.router");
// [http://localhost:3000/]
root.use("/home", home);
// [http://localhost:3000/product]
root.use("/product", product);
// [http://localhost:3000/menu]
root.use("/menu", menu);
//localhost:3000/user
root.use("/user", user);
//localhost:3000/login
root.use("/login", login);
//localhost:3000/auth
root.use("/auth", authenGoogle);

//localhost:3000/card
root.use("/card", card);

//localhost:3000/card
root.use("/bill", billModel);

module.exports = root;
