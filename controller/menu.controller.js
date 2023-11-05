const { model } = require("mongoose");
const productModel = require("../model/product.model");

const getMenu = async (req, res) => {
  //   let GetsubMenu = [];
  //   let menu = [];

  //   const data = await productModel.find({}, { _id: 0, Classification: 1 });
  //   data.forEach((item) => {
  //     if (!menu.includes(item.Classification)) {
  //       menu.push(item.Classification);
  //     }
  //   });

  //   const subData = await productModel.find({}, { _id: 0, SubClassify: 1 });
  //   subData.forEach((item) => {
  //     item.SubClassify.forEach((item) => {
  //       if (!GetsubMenu.includes(item.SubMenu)) {
  //         GetsubMenu.push(item.SubMenu);
  //       }
  //     });
  //   });

  //   const dataMenu = {
  //     menu,
  //     GetsubMenu,
  //   };

  //   console.log(dataMenu);
  //   //   console.log(GetsubMenu);

  const product = await productModel.find();
  const menu = [];
  const classificationSet = new Set(); // Sử dụng Set để theo dõi các Classification đã xuất hiện

  product.forEach((product) => {
    if (!classificationSet.has(product.Classification)) {
      // Nếu Classification chưa có trong Set, thêm vào menu và đánh dấu đã xuất hiện
      classificationSet.add(product.Classification);

      menu.push({
        _id: product._id,
        Classification: product.Classification,
        SubClassify: product.SubClassify,
      });
    }
  });

  res.status(200).json(menu);
};

module.exports = { getMenu };
