const cardModel = require("../model/card.model");
const mongoose = require("mongoose");
const productModel = require("../model/product.model");
const { DeCodeJwt, CodeJwt } = require("../utils/decodeJwt.utils");
const {
  aggregateProductsAndTotal,
  UpdateProduct,
  deleteProduct,
} = require("../utils/calculateTotal.utils");

const InsertCardController = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(400).json({
        status: false,
        data: "Missing token",
      });
    }

    const { _id } = DeCodeJwt(token).data;
    const { products } = req.body;
    const id = new mongoose.Types.ObjectId(_id); // Create ObjectId directly

    const findCard = await cardModel.findOne({ user: id });

    if (!findCard) {
      let dataProduct = [];

      if (products && products.length > 0) {
        dataProduct = products.map((product) => ({ ...product }));
      }

      console.log(dataProduct);

      const insertCard = await cardModel.create({
        user: _id,
        products: dataProduct,
      });

      return res.json(insertCard);
    } else {
      if (products && products.length > 0) {
        const findcard = await cardModel.findOne({ user: id });

        const OldArrProduct = aggregateProductsAndTotal(findcard);

        const resultArray = UpdateProduct(OldArrProduct, products);

        console.log(resultArray);

        await cardModel.findOneAndUpdate(
          { user: id },
          { products: resultArray }
        );

        const newfindcard = await cardModel.findOne({ user: id });
        return res.status(200).json({
          status: true,
          data: newfindcard.products,
        });
      } else {
        return res.status(400).json({
          status: false,
          data: "Update failed. No products provided.",
        });
      }
    }
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({
      status: false,
      data: "Internal Server Error",
    });
  }
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
  const { token } = req.headers;

  // res.json({ result });
  try {
    if (token) {
      const { _id } = DeCodeJwt(token).data;
      const id = new mongoose.Types.ObjectId(_id);
      // const id = new mongoose.Types.ObjectId("655b83acc318123fd8bb4e0c");
      // console.log(id);
      const findCard = await cardModel
        .findOne({ user: id })
        .populate("user")
        .populate("products.product");
      // console.log(findCard);
      if (findCard) {
        // const aggregateProductAndTotal = await aggregateProductsAndTotal(
        //   findCard
        // );
        // console.log(findCard);

        res.status(200).json({
          status: true,
          data: findCard,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "đéo tìm thấy",
        });
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

const deleteProductInCard = async (req, res) => {
  const { token } = req.headers;
  if (token) {
    const { productsDelete } = req.body;

    if (productsDelete) {
      const idUser = DeCodeJwt(token).data._id;
      // console.log(decode);
      const findCardUser = await cardModel.find({ user: idUser });
      const OldArrProduct = findCardUser[0].products;

      let newArrProduct = deleteProduct(OldArrProduct, productsDelete);

      res.json(newArrProduct);
      return;
    }
    res.json("không có sản phẩm cần xóa ");
  } else {
    res.json("login đi thằng lol");
  }
};

module.exports = {
  InsertCardController,
  getAllCard,
  getCarbyId,
  deleteProductInCard,
};
