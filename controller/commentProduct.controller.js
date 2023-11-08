const commentsModel = require("../model/commentProduct.model");
const ProductModel = require("../model/product.model");
const { DeCodeJwt, CodeJwt } = require("../utils/decodeJwt.utils");
const mongoose = require("mongoose");

const createCommentPro = async (req, res) => {
  try {
    const { token } = req.headers;

    if (token) {
      const { _id, UserName } = DeCodeJwt(token).data;

      const { productId, commentText } = req.body;
      if (commentText) {
        const comment = {
          productId: productId,
          usernameId: _id,
          username: UserName,
          commentText: commentText,
        };
        // console.log(comment);

        const createComment = await commentsModel.create(comment);
        res.status(200).json({
          status: false,
          data: createComment,
        });
      } else {
        res.status(400).json({
          status: false,
          data: null,
        });
      }
    } else {
      res.status(400).json({
        status: false,
        data: "login đi thằng lol",
      });
    }
  } catch (error) {}
};

const GetCommentProduct = async (req, res) => {
  const { token } = req.headers;

  if (token) {
    const { _id, UserName } = DeCodeJwt(token).data;

    const { productId } = req.query;
    console.log("productId:   ", productId);
    if (productId) {
      const _idProduct = new mongoose.Types.ObjectId(productId);

      const findProduct = await ProductModel.find({
        _id: _idProduct,
      });
      if (findProduct) {
        const findComment = await commentsModel.find({
          productId: _idProduct,
        });
        //   console.log(findProduct, findComment);
        const productAndcomment = {
          product: findProduct,
          comment: findComment,
        };
        res.status(200).json({
          status: true,
          data: productAndcomment,
        });
        return;
      }
      res.status(400).json({
        status: false,
        data: "dell tim thay product",
      });
      return;
    } else {
      res.status(400).json({
        status: false,
        data: "nhap id product",
      });
      return;
    }
  } else {
    res.status(400).json({
      status: false,
      data: "Login di thang mat lol",
    });
    return;
  }
};

module.exports = { createCommentPro, GetCommentProduct };
