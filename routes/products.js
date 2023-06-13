const express = require("express");
const router = express.Router();
const multer = require("../middlewares/multer");
const productsControllers = require("../controllers/productsControllers");

router.get(
  "/addProduct/:seller_id",
  productsControllers.viewAddProductForm
);
// Add new product From Seller
router.post(
  "/addProduct/:seller_id",
  multer("products"),
  productsControllers.AddProduct
);
//Show Product Edit Form
router.get(
  "/modifyProduct/:product_id/:seller_id",
  productsControllers.viewProductEditForm
);
//Modify product from seller
router.post(
  "/modifyProduct/:product_id/:seller_id",
  multer("products"),
  productsControllers.modifyProduct
);
//Delete product from Seller
router.get(
  "/deleteProduct/:product_id/:seller_id",
  productsControllers.deleteProduct
);
// Show all products
router.get("/allProducts", productsControllers.viewAllProducts);
// Show one product
router.get("/oneProduct/:product_id", productsControllers.viewOneProduct);
// Add product to shopping cart
router.get("/addToCart/:product_id", productsControllers.addToShoppingCart);
// Show shopping cart
router.get("/shoppingCart", productsControllers.viewShoppingCart);
//Remove from shopping cart
router.get(
  "/removeProductCart/:product_id",
  productsControllers.removeProductFromCart
);
router.get("/category/:category", productsControllers.viewCategoryProducts);
module.exports = router;
