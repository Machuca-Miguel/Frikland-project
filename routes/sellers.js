const express = require("express");
const router = express.Router();
const multer = require("../middlewares/multer");
const sellersControllers = require("../controllers/sellersControllers");

// All sellers
router.get("/allSellers", sellersControllers.viewAllSellers);

//register Seller Get
router.get("/resgiterSeller", sellersControllers.viewRegisterSeller);
//Post
router.post(
  "/registerNewSeller",
  multer("avatars"),
  sellersControllers.registerSeller
);

//Show Login Seller;
router.get("/login", sellersControllers.showLogin);
//Login Seller;
router.post("/login", sellersControllers.login);

//One seller.
router.get("/oneSeller/:id", sellersControllers.viewOneSeller);

//Delete Seller
router.get("/logicDeleteSeller/:id", sellersControllers.logicDeleteSeller);

//Form Modify seller;
router.get("/modifySeller/:id", sellersControllers.viewFormModifySeller);

//Modify Seller
router.post(
  "/modifySeller/:id",
  multer("avatars"),
  sellersControllers.editSeller
);

module.exports = router;
