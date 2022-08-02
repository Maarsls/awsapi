var router = require("express").Router();
const Events = require("../model/events");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  Events.find()
    .exec()
    .then(function (users) {
      res.send(users);
    });
});

module.exports = router;
