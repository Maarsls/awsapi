require("dotenv").config();
const seatsio = require("seatsio");

let client = new seatsio.SeatsioClient(
  seatsio.Region.EU(),
  process.env.SEATSIOKEY
);
let orderObject = [

  {
    objectId: "903-2",
    extraData: { order_id: "AGI1070ca62549d", name: "Schmidt" },
  },{
    objectId: "903-3",
    extraData: { order_id: "AGI1070ca62549d", name: "Schmidt" },
  },{
    objectId: "903-4",
    extraData: { order_id: "AGI1070ca62549d", name: "Schmidt" },
  },{
    objectId: "903-5",
    extraData: { order_id: "AGI1070ca62549d", name: "Schmidt" },
  },{
    objectId: "903-6",
    extraData: { order_id: "AGI1070ca62549d", name: "Schmidt" },
  },
  {
    objectId: "903-7",
    extraData: { order_id: "AGI1070ca62549d", name: "Schmidt" },
  }
];
client.events
  .book("agiball2022", orderObject)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  }); //[{objectId: "A1", extraData: {order_id: "123", name: "John"}}] 903,1,2,3,4,9,10,11,12
