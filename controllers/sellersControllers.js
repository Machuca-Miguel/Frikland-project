const bcrypt = require("bcrypt");
const connectionSQL = require("../config/db");

class SellersControllers {
  viewAllSellers = (req, res) => {
    let sql = "SELECT * FROM seller WHERE deleted = 0";

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;
      res.render("allSellers", { result });
    });
  };

  viewRegisterSeller = (req, res) => {
    res.render("formRegisterSeller");
  };

  registerSeller = (req, res) => {
    let { name, last_name, email, password, phone_number, description } =
      req.body;

    /* Validation */
    if (
      name === "" ||
      last_name === "" ||
      email === "" ||
      password === "" ||
      phone_number === "" ||
      description === ""
    ) {
      res.render("formRegisterSeller", {
        message: "Faltan campos por rellenar",
      });
    } else {
      let img;

      if (req.file != undefined) {
        img = req.file.filename;
      } else {
        img = "avatarDefault.png";
      }

      /* Encrypt */
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        let sql = `INSERT INTO seller (name, last_name, email, password, phone_number ,description,profile_img) VALUES ("${name}","${last_name}","${email}","${hash}","${phone_number}","${description}","${img}")`;

        connectionSQL.query(sql, (err, result) => {
          if (err) {
            if (err.errno === 1062) {
              res.render("formRegisterSeller", {
                message: "The e-mail already exist. Try again",
              });
            }
          } else {
            res.redirect("/sellers/allSellers");
          }
        });
      });
    }
  };

  showLogin = (req, res) => {
    res.render("login");
  };

  login = (req, res) => {
    let { email, password } = req.body;

    let sql = `SELECT * from seller WHERE deleted = 0 AND email = "${email}"`;

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length == 1) {
        let hash = result[0].password;

        bcrypt.compare(password, hash, (error, resultComp) => {
          if (resultComp) {
            res.redirect(`/sellers/oneSeller/${result[0].seller_id}`);
          } else {
            res.render("login", { message: "Wrong gmail or password" });
          }
        });
      } else {
        res.render("login", { message: "Wrong gmail or password" });
      }
    });
  };

  viewOneSeller = (req, res) => {
    let id = req.params.id;

    let sql = `SELECT seller.seller_id AS seller_seller_id, seller.description AS seller_description, seller.*, product.*
         FROM seller
            LEFT JOIN product ON seller.seller_id = product.seller_id
            AND product.deleted = 0 WHERE seller.deleted = 0 AND seller.seller_id = ${id}`;

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;

      let finalResult = {};
      let products = [];
      let product = {};

      result.forEach((element) => {
        if (element.product_id) {
          product = {
            product_id: element.product_id,
            product_name: element.product_name,
            category: element.category,
            status: element.status,
            price: element.price,
            description: element.description,
            product_img: element.product_img,
          };
          products.push(product);
        }
      });

      finalResult = {
        seller_id: result[0].seller_seller_id,
        name: result[0].name,
        last_name: result[0].last_name,
        email: result[0].email,
        phone_number: result[0].phone_number,
        description: result[0].seller_description,
        profile_img: result[0].profile_img,
        products,
      };
      res.render("oneSeller", { finalResult });
    });
  };

  logicDeleteSeller = (req, res) => {
    let id = req.params.id;

    let sql = `UPDATE seller LEFT JOIN product ON seller.seller_id = product.seller_id SET seller.deleted = 1 , product.deleted = 1 WHERE seller.seller_id = ${id}`;

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;
      res.redirect("/sellers/allSellers");
    });
  };

  

  editSeller = (req, res) => {
    let id = req.params.id;

    let { name, last_name, phone_number, description } = req.body;

    let sql = `UPDATE seller SET name = "${name}", last_name = "${last_name}", phone_number = "${phone_number}", description = "${description}" WHERE seller_id = ${id}`;

    if (req.file != undefined) {
      let img = req.file.filename;

      sql = `UPDATE seller SET name = "${name}", last_name = "${last_name}", phone_number = "${phone_number}", description = "${description}", profile_img = "${img}" WHERE seller_id = ${id}`;
    }

    connectionSQL.query(sql, (err, result) => {
      if (err) throw err;
      res.redirect(`/sellers/oneSeller/${id}`);
    });
  };
}

module.exports = new SellersControllers();
