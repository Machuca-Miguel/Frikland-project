const express = require("express");
const router = express.Router();
const multer = require("../middlewares/multer")
const sellersControllers  = require("../controllers/sellersControllers");




// All sellers
router.get("/allSellers", sellersControllers.viewAllSellers);

//register Seller Get
router.get("/resgiterSeller", sellersControllers.viewRegisterSeller);
//Post
router.post("/registerNewSeller",multer("avatars"), sellersControllers.registerSeller )

//One seller.
router.get("/oneSeller/:id", sellersControllers.viewOneSeller )

module.exports = router;
