const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const aggregateProductsAndTotal = (findCard) => {
  const products = findCard.products;

  const arrPro = {};
  for (const i of products) {
    const idProduct = i.product;
    const quality = i.quality;

    // trong object arrPro {} không tồn tại khóa (key) [idProduct] thì
    // thêm vào object 1 đối tượng mới là  arrPro[idProduct]
    if (!arrPro[idProduct]) {
      arrPro[idProduct] = {
        product: idProduct,
        quality: quality,
      };
      // console.log("new:  ", arrPro[idProduct]);
    } else {
      arrPro[idProduct].quality += i.quality;
    }
  }

  // Object.values(arrPro) lấy tất cả các giá trị của các thuộc tính (properties) trong arrPro và chuyển chúng thành một mảng mới. Mỗi giá trị trong mảng này tương ứng với một đối tượng sản phẩm đã gom nhóm, chứa thông tin về product (ID sản phẩm) và tổng quality
  const result = Object.values(arrPro);

  //   let total = 0;

  //   for (let i of result) {
  //     let price = Number(i.product.Price) * Number(i.quality);
  //     console.log("i", price);
  //     total += price;
  //   }
  return result;
};

const UpdateProduct2 = (products, ArrProduct) => {
  const combinedArray = ArrProduct.concat(products);

  // Tạo một đối tượng Map để gom nhóm sản phẩm theo ID và tính tổng quality
  const productMap = new Map();

  combinedArray.forEach((product) => {
    const productId = product.product.toString();
    const quality = Number(product.quality);

    if (productMap.has(productId)) {
      // Nếu sản phẩm đã tồn tại, tăng quality lên
      productMap.get(productId).quality += quality;
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm sản phẩm vào Map
      productMap.set(productId, product);
    }
  });
  console.log("productMap:  ", productMap);

  // Chuyển kết quả từ Map thành mảng và giữ nguyên thứ tự
  const resultArray = combinedArray.map((product) => {
    const productId =
      product.product instanceof ObjectId
        ? product.product.toString()
        : product.product;
    return productMap.get(productId);
  });
  return productMap;
};

const UpdateProduct = (products, ArrProduct) => {
  // tạo 1 đối tượng giống như object .
  const productMap = new Map();
  console.log(ArrProduct.concat(products));
  // [
  //   { product: "65473f8c544967929a6fd7ab", quality: "5" },
  //   { product: "6540f8e3b49329153d3813a9", quality: "1" },
  //   { product: new ObjectId("65473f8c544967929a6fd7ab"), quality: 25 },
  //   { product: new ObjectId("6540f8e3b49329153d3813a9"), quality: 4 },
  //   { product: new ObjectId("6540f958b49329153d3813eb"), quality: 4 },
  //   { product: new ObjectId("65472a245dc361729a62587f"), quality: 9 },
  //   { product: new ObjectId("6547382d422a3de661038972"), quality: 3 },
  // ];
  ArrProduct.concat(products).forEach((item) => {
    const productId = item.product.toString(); // Chuyển ObjectId thành chuỗi để so sánh
    const quality = Number(item.quality);

    if (productMap.has(productId)) {
      // Nếu sản phẩm đã tồn tại, tăng quality lên
      //productMap.set(key,{value})
      productMap.set(productId, {
        product: new mongoose.Types.ObjectId(productId),
        // ghi đè giá trị quality : (lấy quanlity gốc) + (quanlity mới)
        quality: productMap.get(productId).quality + quality,
      });
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm sản phẩm vào Map
      productMap.set(productId, {
        product: new mongoose.Types.ObjectId(productId),
        quality,
      });
    }
  });

  // Chuyển kết quả từ Map thành mảng
  const resultArray = Array.from(productMap.values());
  return resultArray;
};

const deleteProduct = (OldArrProduct, productsDelete) => {
  const ArrproductsDelete = productsDelete.filter((item) => {
    return {
      product: item.product.toString(),
      quanlity: Number(item.quanlity),
    };
  });

  const newArrProduct = OldArrProduct.map((product) => {
    const productItem = product.product.toString();
    const qualityItem = Number(product.quality);

    const DeleteItem = ArrproductsDelete.find((item) => {
      if (item.product === productItem) {
        return item;
      }
      return null;
    });

    if (DeleteItem) {
      console.log("delete");
      const newquanlity = qualityItem - quanlityDelete;
      const newProduct = {
        product: item.product,
        quality: newquanlity,
        _id: item._id,
      };
      newArrProduct.push(newProduct);
      return;
    }
    newArrProduct.push(item);
  });
  return newArrProduct;
};

// const deleteProduct = (OldArrProduct, productsDelete) => {
//   const productsToDelete = productsDelete.map((deleteItem) => {
//     return {
//       product: deleteItem.product.toString(),
//       quality: Number(deleteItem.quality),
//     };
//   });

//   console.log("productsToDelete:     ", productsToDelete);

//   const newArrProduct = OldArrProduct.map((item) => {
//     const matchingProduct = productsToDelete.find(
//       (deleteItem) => item.product.toString() === deleteItem.product
//     );

//     // Biến kiểm tra xem đã xử lý sản phẩm trùng nhau hay chưa
//     let processed = false;

//     if (matchingProduct && !processed) {
//       console.log("newArrProduct   ", matchingProduct);
//       processed = true; // Đánh dấu sản phẩm trùng nhau đã được xử lý
//       const newQuality = Number(item.quality) - matchingProduct.quality;
//       return {
//         ...item,
//         quality: newQuality,
//       };
//     }

//     return item;
//   });

//   return newArrProduct;
// };

module.exports = { aggregateProductsAndTotal, UpdateProduct, deleteProduct };
