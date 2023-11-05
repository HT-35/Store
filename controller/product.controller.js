const productModel = require("../model/product.model");
const slugify = require("slugify");

const {
  createProductService,
  findAllProductService,
  findProductService,
  updateProductService,
  deleteProductService,
  deleteForeverProductService,
  RestoreProductService,
} = require("../services/product.vice");

// Create Product Post : http://localhost:3000/product
const createProduct = async (req, res) => {
  let pathImg = null;
  if (req.file) {
    pathImg = req.file.path;
  }

  const {
    Classification,
    SubClassify,
    Unit,
    ProductName,
    Price,
    Status,
    Shipping,
    description,
    InformationProduct,
  } = req.body;

  // console.log({
  //   Classification,
  //   SubClassify,
  //   Unit,
  //   ProductName,
  //   Price,
  //   Status,
  //   Shipping,
  //   description,
  //   InformationProduct,
  // });

  const combinedString = ProductName + "-" + SubClassify["0"].SubMenu;

  const slug = slugify(combinedString, {
    replacement: "-", // Ký tự sẽ thay thế dấu cách
    lower: true, // Chuyển tất cả thành chữ thường
  });

  const ReSubClassify = [
    { SubMenu: SubClassify["0"].SubMenu },
    { SubMenu: SubClassify["1"].SubMenu },
  ];
  const Redescription = {
    description: description.UsageInstructions,
    Notes: description.Notes,
  };

  try {
    const product = await createProductService({
      Classification,
      ReSubClassify,
      ProductName,
      pathImg,
      Price,
      Status,
      Shipping,
      Unit,
      Slug: slug,
      Redescription,
      InformationProduct,
    });

    if (product instanceof Error) {
      if (product.keyPattern) {
        res.status(400).json({
          Status: "fail",
          Data: `tên sản phẩm đã tồn tại : ${product.keyValue.ProductName}`,
        });
        return;
      }
      res.status(400).json({ Status: "fail", Data: product });
      return;
    }
    res.status(200).json({ Status: "true", Data: product });
  } catch (error) {
    // Xử lý lỗi từ try-catch bên ngoài
    res.status(400).json({ Status: "fail", Data: error.message });
  }
};

// get all product : get :  http://localhost:3000/product

const getAllProduct = async (req, res) => {
  const getAllPro = await findAllProductService(req);
  if (getAllPro == "") {
    // console.log(getAllPro);
    res.status(200).json({
      status: "true",
      data: "empty product",
    });
  } else {
    // console.log(getAllPro);
    res.status(200).json({
      status: "true",
      data: getAllPro,
    });
  }
};

// get detail product : http://localhost:3000/product/:slug

const getDetailProduct = async (req, res) => {
  const Slug = req.params.slug;

  try {
    const findProduct = await findProductService(Slug);

    if (findProduct == null) {
      res.status(200).json({
        status: "true",
        data: "not found product",
      });
      return null;
    }

    res.status(200).json({
      status: "true",
      data: findProduct,
    });
    return await findProduct;
  } catch (error) {
    res.status(404).json({
      status: "true",
      data: error,
    });
    return null;
  }
};

// Update Product : Patch : http://localhost:3000/product/:slug
const UpdateProduct = async (req, res) => {
  try {
    const SlugOld = req.params;
    console.log(SlugOld);

    let pathImg = null;
    if (req.file) {
      pathImg = req.file.path;
    }

    const {
      Classification,
      SubClassify,
      Unit,
      ProductName,
      Price,
      Status,
      Shipping,
      description,
      InformationProduct,
    } = req.body;
    const combinedString = ProductName + "-" + SubClassify["0"].SubMenu;

    const Slug = slugify(combinedString, {
      replacement: "-", // Ký tự sẽ thay thế dấu cách
      lower: true, // Chuyển tất cả thành chữ thường
    });
    // console.log(typeof Reslug);

    const ReSubClassify = [
      { SubMenu: SubClassify["0"].SubMenu },
      { SubMenu: SubClassify["1"].SubMenu },
    ];
    const Redescription = {
      description: description.UsageInstructions,
      Notes: description.Notes,
    };

    const update = {
      $set: {
        Classification,
        ReSubClassify,
        ProductName,
        pathImg,
        Price,
        Status,
        Shipping,
        Unit,
        SubClassify,
        Slug: Slug,
        Redescription,
        InformationProduct,
      },
    };

    const updated = await updateProductService(
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
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({
        status: "fail",
        data: `Not Found Product`,
      });
    }

    console.log("updated", updated);

    if (updated.code === 11000) {
      return res.status(400).json({
        status: "true",
        data: `Duplicate key error: ${JSON.stringify(updated.keyValue)}`,
      });
    }

    return res.status(200).json({
      status: "true",
      data: updated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "fail",
        data: `Duplicate key error: ${JSON.stringify(error.keyValue)}`,
      });
    }

    console.error("error: ", error);
    return res.status(500).send(error);
  }
};

const deleteSoftProduct = async (req, res) => {
  try {
    const Slug = req.params.slug;
    const deleltePro = await deleteProductService(Slug);

    console.log(deleltePro);

    if (deleltePro.modifiedCount == 0) {
      return res.status(409).json({
        status: "fail",
        data: `Not Found Product`,
      });
    } else {
      return res.status(200).json({
        status: "true",
        data: `đã xóa thành công`,
      });
    }
  } catch (error) {
    res.status(409).json({
      status: "fail",
      data: error,
    });
  }
};

const deleteForeverProduct = async (req, res) => {
  try {
    const Slug = req.params.slug;
    const deleltePro = await deleteForeverProductService(Slug);

    console.log(deleltePro);

    if (deleltePro.deletedCount == 0) {
      return res.status(409).json({
        status: "fail",
        data: `Not Found Product`,
      });
    } else {
      return res.status(200).json({
        status: "true",
        data: `đã xóa thành công`,
      });
    }
  } catch (error) {
    res.status(409).json({
      status: "fail",
      data: error,
    });
  }
};

const RestoreProduct = async (req, res) => {
  try {
    const Slug = req.params.slug;
    const Restore = await RestoreProductService(Slug);

    // console.log(deleltePro);

    if (Restore.modifiedCount == 0) {
      return res.status(409).json({
        status: "fail",
        data: `Not Found Product`,
      });
    } else {
      return res.status(200).json({
        status: "true",
        data: `đã  Restore`,
      });
    }
  } catch (error) {
    res.status(409).json({
      status: "fail",
      data: error,
    });
  }
};
const getAllDeletSoftProduct = async (req, res) => {
  const data = await productModel.findDeleted({});

  const getAllDeletSoft = data.filter((item) => {
    return item.deleted;
  });

  console.log(getAllDeletSoft);
  if (getAllDeletSoft == "") {
    // console.log(getAllPro);
    res.status(200).json({
      status: "fail",
      data: "empty product",
    });
  } else {
    console.log(getAllDeletSoft);
    res.status(200).json({
      status: "true",
      data: getAllDeletSoft,
    });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getDetailProduct,
  UpdateProduct,
  deleteSoftProduct,
  deleteForeverProduct,
  RestoreProduct,
  getAllDeletSoftProduct,
};
