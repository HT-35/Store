const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/dbStore");
    console.log("connect db successfull !!!");
  } catch (error) {
    console.log("connect db fail !!!");
  }
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};

module.exports = connectDB;
