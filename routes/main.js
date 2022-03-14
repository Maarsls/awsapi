var router = require("express").Router();



router.get("/about", function (req, res) {
  res.send("About Page");
});

module.exports = router;
