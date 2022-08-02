var router = require("express").Router();
const Tickets = require("../model/tickets");

const auth = require("../middleware/auth");

router.get("/:uuid", (req, res) => {
  Tickets.findOne({ uuid: req.params.uuid })
    .exec()
    .then(function (ticket) {
      if (ticket) res.send({ success: true, ticket: ticket });
      else res.send({ success: false });
    });
});

router.post("/", auth, async (req, res) => {
  const entriesRes = await Tickets.create(req.body.ticket);

  res.send(entriesRes);
});

router.post("/updateEntrance", async (req, res) => {
  if (req.query.token == process.env.AUTHTOKEN) {
    const entriesRes = await Tickets.updateOne({ event: req.query.event, uuid: req.query.uuid }, {
      status: 'ENTERED'
    });

    res.send({ success: true, entries: entriesRes });
  }
});

router.get("/byUser/:nuuid", auth, async (req, res) => {
  Tickets.find({ customer: "notgiven" })
    .exec()
    .then(function (tickets) {
      if (tickets) res.send({ success: true, ticket: tickets });
      else res.send({ success: false });
    });
});

module.exports = router;
