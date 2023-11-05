const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const userSchema = new mongoose.Schema({
  UserName: {
    type: String,
    unique: true,
    required: true,
  },
  Password: {
    type: String,
    required: false,
  },
  NumberPhone: {
    type: String,
    required: false,
  },
  Email: {
    type: String,
    require: true,
  },
  Role: {
    type: String,
    required: true,
  },
});
userSchema.plugin(mongoose_delete, {
  overrideMethods: "all",
  deletedAt: true,
  deleted: true,
  indexFields: true,
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
