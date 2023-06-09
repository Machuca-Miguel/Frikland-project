const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexControllers");

/* GET home */
router.get("/", indexController.viewHome);

module.exports = router;
