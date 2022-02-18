var router = require("express").Router();
const uidMaker = require("uuid");
const orderid = require("order-id")("key");

const Orders = require("../model/orders");
const Tickets = require("../model/tickets");

router.get("/", (req, res) => {
  Orders.find({})
    .exec()
    .then(function (orders) {
      if (orders) res.send(orders);
      else res.send({ success: false });
    });
});

router.post("/proceed", async (req, res) => {
  let orderObject = {
    orderId: orderid.generate(new Date()),
    orderTime: new Date(),
    customer: { email: "max.mustermann@gmx.at", nuuid: "notgiven" },
    tickets: [],
  };

  orderObject.customer.email = req.body.customer.email;
  orderObject.customer.nuuid = req.body.customer.nuuid
    ? req.body.customer.nuuid
    : "notgiven";

  req.body.tickets.forEach(async (element) => {
    const ticketInsert = {
      uuid: uidMaker.v4(),
      activationTime: new Date(),
      status: "ORDERED",
      type: element.type,
      customer: req.body.customer.nuuid ? req.body.customer.nuuid : "notgiven",
    };
    console.log(ticketInsert);
    orderObject.tickets.push({ uuid: ticketInsert.uuid });
    await Tickets.create(ticketInsert);
  });

  await Orders.create(orderObject);

  res.send({ orderId: orderObject.orderId });
});

router.get("/about", function (req, res) {
  res.send("About Page");
});

module.exports = router;
