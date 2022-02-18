var router = require("express").Router();

router.get("/redirectQr/:uuid", async (req, res) => {
  res.redirect("https://google.at"); //TODO: change to our domain
});

router.get("/about", function (req, res) {
  res.send("About Page");
});

module.exports = router;
