class IndexController {
  
  viewHome = (req, res) => {
    res.render("home");
  };
}

module.exports = new IndexController();
