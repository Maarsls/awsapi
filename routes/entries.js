var router = require("express").Router();
const Entries = require("../model/entries");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  Entries.find()
    .exec()
    .then(function (users) {
      console.log(users);
      res.send(users);
    });
});

router.post("/", async (req, res) => {
  const entryRes = await Entries.create(req.body.entry);

  res.send(entryRes);
});

router.get("/about", function (req, res) {
  res.send("About Page");
});

module.exports = router;
