const connectionSQL = require("../config/db");

class ProductsControllers {

  viewAddProductForm = (req, res) => {
    let seller_id = req.params.seller_id;

    res.render("formAddProduct",{ seller_id})
  }

  AddProduct = (req, res) => {
    let { seller_id } = req.params;
    let { product_name, category, status, price, description } = req.body;

    if (
      product_name === "" ||
      category === "" ||
      status === "" ||
      price === "" ||
      description === "" ||
      req.file == undefined
    ) {
      res.render("formAddProduct" , { message: "All field must be filled" , seller_id});
    } else{
     
      let img = req.file.filename;

      let sql = `INSERT INTO product (seller_id, product_name, category, status, price, description, product_img) VALUES ( ${seller_id} ,"${product_name}", "${category}" , ${status}, ${price} ,"${description}", "${img}")`;

      connectionSQL.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect(`/sellers/oneSeller/${seller_id}`);
      });

    }
  };

  viewProductEditForm = (req, res) => {
    let prod_id = req.params.product_id;
    let seller_id = req.params.seller_id;

    let sql = `SELECT * FROM product WHERE deleted = 0 AND product_id = ${prod_id}`;

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;

      let status_product;

      switch (result[0].status) {
        case 1:
          status_product = STATUS_1;
          break;
        case 2:
          status_product = STATUS_2;
          break;
        case 3:
          status_product = STATUS_3;
          break;
        case 4:
          status_product = STATUS_4;
          break;
        case 5:
          status_product = STATUS_5;
          break;
      }

      res.render("formEditProduct", { result, status_product });
    });
  };

  modifyProduct = (req, res) => {
    let prod_id = req.params.product_id;
    let seller_id = req.params.seller_id;

    let { product_name, category, status, price, description } = req.body;

    if (
      product_name === "" ||
      category === "" ||
      status === "" ||
      price === "" ||
      description === ""
    ) {
      res.redirect(`/products/modifyProduct/${prod_id}/${seller_id}`);
    }

    let sql = `UPDATE product SET product_name = "${product_name}", category = "${category}", status = ${status}, price = ${price}, description = "${description}" WHERE product_id = ${prod_id}`;

    if (req.file != undefined) {
      let img = req.file.filename;

      sql = `UPDATE product SET product_name = "${product_name}", category = "${category}", status = ${status}, price = ${price}, description = "${description}", product_img = "${img}" WHERE product_id = ${prod_id} `;
    }

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;

      res.redirect(`/sellers/oneSeller/${seller_id}`);
    });
  };

  deleteProduct = (req, res) => {
    let seller_id = req.params.seller_id;
    let product_id = req.params.product_id;

    let sql = `UPDATE product SET deleted = 1 WHERE seller_id = ${seller_id} AND product_id = ${product_id}`;

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;
      res.redirect(`/sellers/oneSeller/${seller_id}`);
    });
  };

  viewAllProducts = (req, res) => {
    let sql = `SELECT * FROM product WHERE deleted = 0`;
    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;

      result.forEach((prod) => {
        switch (prod.status) {
          case 1:
            prod.status = "Very Good / Almost new";
            break;
          case 2:
            prod.status = "Good";
            break;
          case 3:
            prod.status = "Regular / OK";
            break;
          case 4:
            prod.status = "Bad";
            break;
          case 5:
            prod.status = "Repair needed";
            break;
        }
      });

      result.forEach((prod) => {
        prod.added_cart == 1
          ? (prod.added_cart = "Added")
          : (prod.added_cart = null);
      });

      res.render("allProducts", { result, title: "Products" });
    });
  };

  viewOneProduct = (req, res) => {
    let prod_id = req.params.product_id;

    let sql = `SELECT * FROM product WHERE deleted = 0 AND product_id = ${prod_id}`;

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;

      switch (result[0].status) {
        case 1:
          result[0].status = STATUS_1;
          break;
        case 2:
          result[0].status = STATUS_2;
          break;
        case 3:
          result[0].status = STATUS_3;
          break;
        case 4:
          result[0].status = STATUS_4;
          break;
        case 5:
          result[0].status = STATUS_5;
          break;
      }
      res.render("oneProduct", { result });
    });
  };
  viewShoppingCart = (req, res) => {
    let sql = `SELECT * FROM product WHERE deleted = 0 AND added_cart = 1`;

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;

      result.forEach((prod) => {
        switch (prod.status) {
          case 1:
            prod.status =STATUS_1;
            break;
          case 2:
            prod.status = STATUS_2;
            break;
          case 3:
            prod.status = STATUS_3;
            break;
          case 4:
            prod.status = STATUS_4;
            break;
          case 5:
            prod.status = STATUS_5;
            break;
        }
      });

      res.render("shoppingCart", { result });
    });
  };

  addToShoppingCart = (req, res) => {
    let product_id = req.params.product_id;

    let sql = `UPDATE product SET added_cart = 1 WHERE deleted = 0 AND product_id = ${product_id}`;

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;

      res.redirect("/products/allProducts");
    });
  };

  removeProductFromCart = (req, res) => {
    let prod_id = req.params.product_id;

    let sql = `UPDATE product SET added_cart = 0 WHERE product_id = ${prod_id}`;

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;
      res.redirect("/products/shoppingCart");
    });
  };

  viewCategoryProducts = (req, res) => {
    let category = req.params.category;

    let sql = `SELECT * FROM product WHERE deleted = 0 AND category = "${category}"`;

    connectionSQL.query(sql, (error, result) => {
      if (error) throw error;
      result.forEach((prod) => {
        switch (prod.status) {
          case 1:
            prod.status = STATUS_1;
            break;
          case 2:
            prod.status = STATUS_2;
            break;
          case 3:
            prod.status = STATUS_3;
            break;
          case 4:
            prod.status =STATUS_4;
            break;
          case 5:
            prod.status = STATUS_5;
            break;
        }
      });

      result.forEach((prod) => {
        prod.added_cart == 1
          ? (prod.added_cart = "Added")
          : (prod.added_cart = null);
      });

      res.render("allProducts", { result, title: `${category}` });
    });
  };
}

const STATUS_1 = "Very Good / Almost new";
const STATUS_2 = "Good";
const STATUS_3 = "Regular / Ok";
const STATUS_4 = "Bad";
const STATUS_5 = "Repair needed";

module.exports = new ProductsControllers();
