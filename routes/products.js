const express = require("express");
const router = express.Router();
const multer = require("../middlewares/multer");
const productsControllers = require("../controllers/productsControllers");

/* Add product Form */
router.get("/addProduct/:seller_id", productsControllers.viewAddProductForm);

/* Add product */
router.post(
  "/addProduct/:seller_id",
  multer("products"),
  productsControllers.AddProduct
);

router.get("/allProducts", productsControllers.viewAllProducts);

module.exports = router;
