var router = require("express").Router();
const Tickets = require("../model/tickets");

const auth = require("../middleware/auth");

router.get("/:uuid", (req, res) => {
  Tickets.findOne({ uuid: req.params.uuid })
    .exec()
    .then(function (ticket) {
      if (ticket) res.send(ticket);
      else res.send({ success: false });
    });
});

router.post("/", auth, async (req, res) => {
  const entriesRes = await Tickets.create(req.body.ticket);

  res.send(entriesRes);
});

router.get("/byUser/:nuuid", auth, async (req, res) => {
  Tickets.find({ customer: "notgiven" })
    .exec()
    .then(function (tickets) {
      if (tickets) res.send({ success: true, ticket: tickets });
      else res.send({ success: false });
    });
});

router.get("/about", function (req, res) {
  res.send("About Page");
});

module.exports = router;
