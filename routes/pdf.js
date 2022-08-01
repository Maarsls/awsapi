var router = require("express").Router();
const path = require("path");

router.get("/", (req, res) => {
  res.render(__dirname + "/../static/template.html", { name: req.query.name });
});

router.get("/tyvent-ticket", (req, res) => { res.sendFile(path.join(__dirname, '/../tyvent-ticket/ticket-vorlage.html')); })

module.exports = router;
