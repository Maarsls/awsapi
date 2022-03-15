var router = require("express").Router();
const Partner = require("../model/partner");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  Partner.find()
    .exec()
    .then(function (partner) {
      if (partner) res.send(partner);
      else res.send({ success: false });
    });
});

router.post("/", auth, async (req, res) => {
  const partnerRes = await Partner.create(req.body.partner);

  res.send(partnerRes);
});

router.get("/about", function (req, res) {
  res.send("This is the api call for getting current partners");
});

module.exports = router;
