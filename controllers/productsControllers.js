const { query } = require("express");
const connectionSQL = require("../config/db");

class ProductsControllers {
  viewAddProductForm = (req, res) => {
    let seller_id = req.params.seller_id;

    console.log(seller_id);

    res.render("formAddProduct", { id: seller_id });
  };

  AddProduct = (req, res) => {
    let { seller_id } = req.params;
    let { product_name, category, status, price, description } = req.body;

    if (
      product_name === "" ||
      category === "" ||
      status === "" ||
      price === "" ||
      description === ""
    ) {
      res.render("formAddProduct", {
        message: "Every field must be filled",
        id: seller_id,
      });
    } else if (req.file != undefined) {
      let img = req.file.filename;

      let sql = `INSERT INTO product (seller_id, product_name, category, status, price, description, product_img) VALUES ( ${seller_id} ,"${product_name}", "${category}" , ${status}, ${price} ,"${description}", "${img}")`;

      connectionSQL.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect(`/sellers/oneSeller/${seller_id}`);
      });
    } else {
      res.render("formAddProduct", {
        message: "Every field must be filled",
        id: seller_id,
      });
    }
  };

  viewAllProducts = (req, res) => {
    let sql = `SELECT * FROM product WHERE deleted = 0`;
    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;
      res.render("allProducts", { result });
    });
  };
}

module.exports = new ProductsControllers();
