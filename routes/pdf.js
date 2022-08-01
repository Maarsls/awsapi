var router = require("express").Router();
const path = require("path");

router.get("/", (req, res) => {
  res.render(__dirname + "/../static/template.html", { name: req.query.name });
});

router.get("/tyvent-ticket", (req, res) => {
  res.render(path.join(__dirname, '/../tyvent-ticket/ticket-vorlage.ejs'), { data: { event: req.query.event, type: req.query.type, uuid: req.query.uuid, payment: req.query.payment } });
})

module.exports = router;
