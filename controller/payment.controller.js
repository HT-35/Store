const { billModel } = require("../model/payment.model");
const productModel = require("../model/product.model");
const { ObjectId } = require("bson-objectid");

const { DeCodeJwt, CodeJwt } = require("../utils/decodeJwt.utils");
// const mongoose = require("mongoose");
const mongoose = require("mongoose");

const createBill = async (req, res) => {
  try {
    const { token } = req.headers;

    if (token) {
      const { _id } = await DeCodeJwt(token).data;
      const idUser = new mongoose.Types.ObjectId(_id);
      let { products } = req.body;

      let total = 0;

      // console.log(products.entries());
      const updateProducts = async () => {
        for (const [index, element] of products.entries()) {
          const id = new mongoose.Types.ObjectId(element.detailProduct);
          const quality = Number(element.quality);
          products[index] = {
            detailProduct: id,
            quality: quality,
          };
          // tổng tiền
          const findproduct = await productModel.findById(id);
          const price = findproduct.Price;
          // console.log(price);

          total += Number(price) * quality;
          // return price; // Lưu ý rằng giá trị này sẽ chỉ trả về từ lần lặp đầu tiên
        }
      };

      await updateProducts();

      const result = Number(total);
      const createBill = await billModel.create({
        products,
        total: result,
        user: idUser,
      });
      console.log(createBill);
      res.json({
        createBill,
      });
    }
  } catch (error) {
    res.json({
      status: false,
      data: error,
    });
  }
};

module.exports = {
  createBill,
};
