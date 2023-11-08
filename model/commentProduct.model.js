const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const ProductModel = require("../model/product.model");
const UserModel = require("./user.model");
const commentSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ProductModel,
    required: true,
  },
  usernameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  commentText: String,
  timestamp: { type: Date, default: Date.now },
});
commentSchema.plugin(mongoose_delete, {
  overrideMethods: "all",
  deletedAt: true,
  deleted: true,
  indexFields: true,
});
const commentsModel = mongoose.model("commentsModel", commentSchema);

module.exports = commentsModel;
