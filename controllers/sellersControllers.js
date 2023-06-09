const bcrypt = require("bcrypt")
const connectionSQL = require("../config/db")

class SellersControllers {

    viewAllSellers = (req, res) => {
        let sql = "SELECT * FROM seller WHERE deleted = 0"

        connectionSQL.query(sql, (err,result) => {
            if(err) throw err;
            res.render("allSellers", { result })
        })
    
    }

    viewRegisterSeller = (req,res) => {
        res.render("formRegisterSeller")

    }

    registerSeller = (req, res) => {
        let {name, last_name, email, password, phone_number,description} = req.body

        /* Validation */
        if (name === "" || last_name === "" || email === "" || password === "" || phone_number === "" || description === ""){
            res.render("formRegisterSeller", {message :"Faltan campos por rellenar"});
        }else {
            let img
            
            if (req.file != undefined){
                img = req.file.filename
            }else{
                img = "avatarDefault.png"
            }
            
            /* Encrypt */
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) throw err;

                let sql = `INSERT INTO seller (name, last_name, email, password, phone_number ,description,profile_img) VALUES ("${name}","${last_name}","${email}","${hash}","${phone_number}","${description}","${img}")`
        
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
    }

    viewOneSeller = (req, res) => {
        let id = req.params.id;

        let sql = `SELECT seller.seller_id as seller_seller_id, seller.*, product.*
         FROM seller
            LEFT JOIN product ON seller.seller_id = product.seller_id
            WHERE seller.deleted = 0 AND product.deleted = 0 AND seller.seller_id = ${id}`;

            connectionSQL.query(sql, (err,result) => {
                if(err) throw err;

                let finalResult = {};
                let products = [];
                let product = {};

                result.forEach(( element) => {
                    if (element.product_id){
                        product = {
                            product_id : element.product_id,
                            product_name : element.product_name,
                            category : element.category,
                            status : element.status,
                            price : element.price,
                            description : element.description,
                            product_img : element.product_img
                        }
                        products.push(product)
                    }
                })

                finalResult = {
                    seller_id : result[0].seller_seller_id,
                    name : result[0].name,
                    last_name : result[0].last_name,
                    email : result[0].email,
                    phone_number : result[0].phone_number,
                    description : result[0].description,
                    profile_img : result[0].profile_img,
                    products
                }
                res.render("oneSeller", { finalResult })
            })

    }
}

module.exports = new SellersControllers();