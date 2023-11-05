const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const userModel = require("./user.model");
const productModel = require("./product.model");
const cardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
    required: true,
    unique: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: productModel,
        required: true,
        default: null,
      },
      quality: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  total: {
    type: Number,
    require: true,
    default: 0,
  },
});

cardSchema.plugin(mongoose_delete, {
  overrideMethods: "all",
  deletedAt: true,
  deleted: true,
  indexFields: true,
});

const CardModel = mongoose.model("CardModel", cardSchema);

module.exports = CardModel;
