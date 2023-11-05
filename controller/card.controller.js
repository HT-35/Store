const cardModel = require("../model/card.model");
const mongoose = require("mongoose");
const productModel = require("../model/product.model");
const { DeCodeJwt, CodeJwt } = require("../utils/decodeJwt.utils");

const InsertCardController = async (req, res) => {
  const { user, products } = req.body;
  const id = new mongoose.Types.ObjectId(`${user}`);
  let total = 0;
  let dataProduct = [];

  if (products) {
    let PriceProduct = [];
    for (let i of products) {
      // đẩy từng item của product vào mảng product
      dataProduct.push(i);
      // lấy id của product để tính giá
      const id = i.product;
      const findItem = await productModel.findById({ _id: id });
      let price = findItem.Price;
      // console.log(price);
      PriceProduct.push(price);
    }
    total = PriceProduct.reduce((acc, currentValue) => acc + currentValue, 0);
  }

  console.log(dataProduct);

  const insertCard = await cardModel.create({
    user: id,
    products: dataProduct,
    total,
  });
  //   console.log(insertCard);
  res.json(insertCard);
};

const getAllCard = async (req, res) => {
  const card = await cardModel
    .find()
    .populate("user")
    .populate("products.product");
  console.log(card);
  res.json(card);
};

const getCarbyId = async (req, res) => {
  try {
    const { token } = req.headers;
    if (token) {
      const { _id, UserName, Role } = DeCodeJwt(token).data;
      console.log({ _id, UserName, Role });
      const findCard = await cardModel
        .findOne({ user: _id })
        .populate("user")
        .populate("products.product");

      //   console.log(price);
      if (findCard) {
        res.json(findCard);
      } else {
        res.json("dell tim thay dm");
      }
    } else {
      res.json("vui long Login");
    }
  } catch (error) {
    console.log("error:  ", error);
    res.status(400).json({
      status: false,
      data: error,
    });
  }
};

const ChangeProductInCard = async (req, res) => {
  const { token } = req.headers;
  if (token) {
    const { _id, UserName, Role } = DeCodeJwt(token).data;
    const { products } = req.body;
    let total = 0;
    let dataProduct = [];

    if (products) {
      let PriceProduct = [];
      for (let i of products) {
        // đẩy từng item của product vào mảng product
        dataProduct.push(i);
        // lấy id của product để tính giá
        const id = i.product;
        const findItem = await productModel.find({ _id: id });
        let price = findItem.Price;
        // console.log(price);
        PriceProduct.push(price);
      }
      total = PriceProduct.reduce((acc, currentValue) => acc + currentValue, 0);
    }
    // console.log(total);
    // console.log(dataProduct);
    if (dataProduct.length > 0) {
      const findcard = await cardModel.findOne({ user: _id });
      let arr = findcard.products;
      for (let i of dataProduct) {
        arr.push(i);
      }
      const card = await cardModel.findOneAndUpdate(
        { user: _id },
        { products: arr }
      );
      console.log("card: ", card);
      res.json(card);
    } else {
    }
  } else {
    res.json("dang nhap di thang lol");
  }
};

module.exports = {
  InsertCardController,
  getAllCard,
  getCarbyId,
  ChangeProductInCard,
};
