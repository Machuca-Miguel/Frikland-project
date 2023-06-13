const connectionSQL = require("../config/db");

class IndexController {
  viewHome = (req, res) => {
    let sql1 = "SELECT * FROM seller WHERE deleted = 0";
    let sql2 = "SELECT * FROM product WHERE deleted = 0";
   

    let finalResult = [];
    connectionSQL.query(sql1, (err1, result1) => {
      if (err1) throw err1;
      finalResult.push(result1);
    });
    connectionSQL.query(sql2, (err2, result2) => {
      if (err2) throw err2;

      result2.forEach((prod) => {
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
      finalResult.push(result2);
      res.render("home", { finalResult });
    });
  };
}

module.exports = new IndexController();
