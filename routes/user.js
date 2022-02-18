var router = require("express").Router();
const User = require("../model/user");

router.get("/:nuuid", (req, res) => {
  User.findOne({ nuuid: req.params.nuuid })
    .exec()
    .then(function (user) {
      if (user) res.send(user);
      else res.send({ success: false });
    });
});

router.post("/", async (req, res) => {
  const userRes = await User.create(req.body.user);

  res.send(userRes);
});

router.get("/about", function (req, res) {
  res.send("About Page");
});

module.exports = router;
