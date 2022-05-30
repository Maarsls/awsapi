require("dotenv").config();
const seatsio = require("seatsio");

let client = new seatsio.SeatsioClient(
  seatsio.Region.EU(),
  process.env.SEATSIOKEY
);
let orderObject = [
  {
    objectId: "206-6",
    extraData: { order_id: "AGI1072ca62549d", name: "Zepharovich" },
  },
];
client.events
  .book("agiball2022", orderObject, "asdfasdfasdf")
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  }); //[{objectId: "A1", extraData: {order_id: "123", name: "John"}}]
