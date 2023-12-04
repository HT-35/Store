const mongoose = require("mongoose");

const productModel = require("../model/product.model");

const createProductService = async ({
  Unit,
  ProductName,
  pathImg,
  Price,
  Status,
  Shipping,
  Classification,
  ReSubClassify,
  Slug,
  Redescription,
  InformationProduct,
}) => {
  try {
    // console.log(pathExtentionImg);
    const product = await productModel.create({
      Unit,
      ProductName,
      Image: pathImg,
      Price,
      Status,
      Shipping,
      Classification,
      SubClassify: ReSubClassify,
      Slug,
      description: {
        UsageInstructions: Redescription.description,
        Notes: Redescription.Notes,
      },
      InformationProduct,
    });

    return product;
  } catch (error) {
    // Xử lý lỗi validation nếu có
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (e) => e.message
      );
      return validationErrors;
    }

    return error;
  }
};

const findAllProductService = async (req) => {
  try {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const getAllPro = await productModel
      .find()
      .sort({ Price: -1 })
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit);
    // console.log(getAllPro);

    return await getAllPro;
  } catch (error) {
    return error;
  }
};

const findProductService = async (Slug) => {
  try {
    const findProduct = await productModel.findOne({ Slug });
    return await findProduct;
  } catch (error) {
    return error;
  }
};

const updateProductService = async (
  SlugOld,
  Classification,
  ReSubClassify,
  ProductName,
  pathImg,
  Price,
  Status,
  Shipping,
  Unit,
  Slug,
  Redescription,
  InformationProduct
) => {
  try {
    // const filter = { Slug: SlugOld.slug }; // Điều kiện để tìm bản ghi cần cập nhật

    // Chỉ lấy giá trị Slug từ Reslug
    // const updatedSlug = Slug.slug; // Truy cập trường "slug" trong đối tượng Reslug
    console.log("Slug:  1", Slug);
    // console.log("SlugOld:  2", filter);

    // Dữ liệu cập nhật
    const updated = await productModel.updateOne(
      { Slug: SlugOld.slug },
      {
        Unit,
        ProductName,
        Image: pathImg,
        Price,
        Status,
        Shipping,
        Classification,
        SubClassify: ReSubClassify,
        Slug,
        description: {
          UsageInstructions: Redescription.UsageInstructions,
          Notes: Redescription.Notes,
        },
        InformationProduct,
      }
    );

    // const updated = await productModel.findOne({ Slug: SlugOld.slug });

    console.log("updated: ", updated);
    return updated;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const deleteProductService = async (slug) => {
  const deleltePro = await productModel.delete({
    Slug: slug,
  });
  // console.log("delete:  ", deleltePro);
  return deleltePro;
};

const deleteForeverProductService = async (slug) => {
  const deleltePro = await productModel.deleteOne({
    Slug: slug,
  });
  // console.log("delete:  ", deleltePro);
  return deleltePro;
};

const RestoreProductService = async (slug) => {
  const deleltePro = await productModel.restore({
    Slug: slug,
  });
  console.log(deleltePro);
  return deleltePro;
};

module.exports = {
  createProductService,
  findAllProductService,
  findProductService,
  updateProductService,
  deleteProductService,
  deleteForeverProductService,
  RestoreProductService,
};
