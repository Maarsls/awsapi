var router = require("express").Router();
const Tickets = require("../model/tickets");
var bodyParser = require('body-parser');

const auth = require("../middleware/auth");

router.get("/:uuid", (req, res) => {
  if (req.query.token == process.env.AUTHTOKEN) {
    Tickets.findOne({ uuid: req.params.uuid })
      .exec()
      .then(function (ticket) {
        if (ticket) res.send({ success: true, ticket: ticket });
        else res.send({ success: false });
      });
  }
});

router.post("/", bodyParser.json(), async (req, res) => {
  if (req.query.token == process.env.AUTHTOKEN) {
    req.body.ticket.forEach(async (element) => {
      const entriesRes = await Tickets.create(element);
      console.log(entriesRes)
    });

    res.send({ success: true });
  } else {
    res.send({ success: false })
  }
});

router.post("/updateEntrance", async (req, res) => {
  if (req.query.token == process.env.AUTHTOKEN) {
    const entriesRes = await Tickets.updateOne({ event: req.query.event, uuid: req.query.uuid }, {
      status: 'ENTERED'
    });

    res.send({ success: true, entries: entriesRes });
  }
});

router.get("/byIssuer/:nuuid", async (req, res) => {
  Tickets.find({ issuer: req.params.nuuid })
    .exec()
    .then(function (tickets) {
      if (tickets) res.send({ success: true, ticket: tickets.length });
      else res.send({ success: false });
    });
});

module.exports = router;
