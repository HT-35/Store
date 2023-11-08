const express = require("express");
const cardRouter = express.Router();

const {
  InsertCardController,
  getAllCard,
  getCarbyId,
  addProductInCard,
  deleteProductInCard,
} = require("../controller/card.controller");

// localhost:3000/card
cardRouter.post("/", InsertCardController);
// localhost:3000/card
cardRouter.get("/", getAllCard);
// localhost:3000/card/user

cardRouter.get("/user", getCarbyId);
// localhost:3000/card/add
cardRouter.post("/add", addProductInCard);
// localhost:3000/card/add
cardRouter.post("/delete", deleteProductInCard);
module.exports = cardRouter;
