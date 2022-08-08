var router = require("express").Router();
const Events = require("../model/events");

router.get("/", (req, res) => {
  Events.find()
    .exec()
    .then(function (users) {
      res.send(users.map((element) => { return {event: element.event} }));
    });
});

module.exports = router;
