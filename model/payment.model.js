const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const productModel = require("./product.model");
const userModel = require("./user.model");
const billSchemal = new mongoose.Schema({
  products: [
    {
      detailProduct: {
        type: mongoose.Schema.ObjectId,
        ref: productModel,
        required: true,
      },
      quality: {
        type: Number,

        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: userModel,
    required: true,
  },
});

const billModel = mongoose.model("billModel", billSchemal);

module.exports = { billModel };
