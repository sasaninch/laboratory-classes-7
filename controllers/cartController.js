const Product = require("../models/Product");
const Cart = require("../models/Cart");

const { STATUS_CODE } = require("../constants/statusCode");

exports.addProductToCart = async (request, response) => {
  try {
    await Product.add(request.body);
    await Cart.add(request.body.name);
    response.status(STATUS_CODE.FOUND).redirect("/products/new");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    response.status(STATUS_CODE.FOUND).redirect("/products/new");
  }
};

exports.getProductsCount = async () => {
  try {
    return await Cart.getProductsQuantity();
  } catch (error) {
    console.error("Error getting products count:", error);
    return 0;
  }
};