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
  const { token } = req.headers;

  // res.json({ result });
  try {
    if (token) {
      const { _id, UserName, Role } = DeCodeJwt(token).data;

      const findCard = await cardModel
        .findOne({ user: _id })
        .populate("user")
        .populate("products.product");
      //   console.log(price);
      if (findCard) {
        const aggregateProductAndTotal = await aggregateProductsAndTotal(
          findCard
        );

        res.status(200).json({
          status: true,
          data: { aggregateProductAndTotal },
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
const addProductInCard = async (req, res) => {
  const { token } = req.headers;

  try {
    if (token) {
      const { _id, UserName, Role } = DeCodeJwt(token).data;
      const { products } = req.body;
      let total = 0;

      if (products) {
        for (let i of products) {
          const id = i.product;
          const findItem = await productModel.find({ _id: id });
          total += Number(findItem[0].Price);
        }
      }

      // thêm product
      if (products.length > 0) {
        const findcard = await cardModel.findOne({ user: _id });

        const OldArrProduct = aggregateProductsAndTotal(findcard);

        // Chuyển kết quả từ Map thành mảng
        const resultArray = UpdateProduct(OldArrProduct, products);

        // console.log(resultArray);

        // const card = await cardModel.findOneAndUpdate(
        //   { user: _id },
        //   { products: resultArray }
        // );
        console.log(resultArray);

        const newfindcard = await cardModel.findOne({ user: _id });
        res.status(200).json({
          status: true,
          data: resultArray,
        });
        return;
      }
      res.status(400).json({
        status: false,
        data: "update false",
      });
    } else {
      res.status(400).json({
        status: false,
        data: "dang nhap di thang lol",
      });
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
      // delete and create New Arr

      // OldArrProduct.filter((item) => {
      //   const productItem = item.product.toString();
      //   const productDelete = products[0].product;
      //   let qualityItem = Number(item.quality);
      //   let quanlityDelete = Number(products[0].quality);
      //   if (productDelete === productItem) {
      //     console.log("delete");
      //     const newquanlity = qualityItem - quanlityDelete;
      //     const newProduct = {
      //       product: item.product,
      //       quality: newquanlity,
      //       _id: item._id,
      //     };
      //     newArrProduct.push(newProduct);
      //     return;
      //   }
      //   newArrProduct.push(item);
      // });
      // await cardModel.findOneAndUpdate(
      //   { user: idUser },
      //   { products: newArrProduct }
      // );

      // console.log("newArrProduct", newArrProduct);
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
  addProductInCard,
  deleteProductInCard,
};
