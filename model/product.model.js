const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const descriptionSchema = new mongoose.Schema({
  UsageInstructions: {
    type: String,
    required: true,
  },
  Notes: "string",
});

const subclassify = new mongoose.Schema({
  SubMenu: {
    type: String,
  },
});

const productSchema = new mongoose.Schema({
  Classification: {
    type: String,
    required: true,
  },
  SubClassify: [subclassify],
  ProductName: {
    type: String,
    unique: true,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
    min: 1,
  },
  Unit: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  Shipping: {
    type: String,
    required: true,
  },

  Slug: {
    type: String,
    required: true,
  },
  description: [descriptionSchema],
  InformationProduct: {
    type: String,
    required: true,
  },
});

productSchema.plugin(mongoose_delete, {
  overrideMethods: "all",
  deletedAt: true,
  deleted: true,
  indexFields: true,
});
// productSchema.index({ deletedAt: 1 });
const productModel = mongoose.model("producModel", productSchema);

module.exports = productModel;
