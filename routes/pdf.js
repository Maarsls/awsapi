var router = require("express").Router();
const path = require("path");

router.get("/", (req, res) => {
  res.render(__dirname + "/../static/template.html", { name: req.query.name });
});

module.exports = router;
