var router = require("express").Router();
const Seats = require("../model/seats");

router.get("/", (req, res) => {
  Seats.find()
    .exec()
    .then(function (seats) {
      let result = [];
      seats.forEach((element) => {
        result.push({
          section: element.section,
          table: element.table,
          seat: element.seat,
          uniquekey: element.uniquekey,
          isBought: element.isBought
        });
      });
      console.log(result);
      res.send(result);
    });
});

router.post("/", async (req, res) => {
  const seatsRes = await Seats.create(req.body.seats);

  res.send(seatsRes);
});

router.put("/update/:uniqueId", async (req, res) => {
  const uniquekey = req.params.uniqueId;
  const seatsRes = await Seats.updateOne(
    { uniquekey: uniquekey },
    { $set: { family: req.body.family, isBought: true } }
  );

  res.send(seatsRes);
});

router.get("/about", function (req, res) {
  res.send("About Page");
});

module.exports = router;
