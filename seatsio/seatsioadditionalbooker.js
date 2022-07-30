require("dotenv").config();
const seatsio = require("seatsio");

let client = new seatsio.SeatsioClient(
  seatsio.Region.EU(),
  "46f29735-c58a-4e29-ac31-c53279c28e80"
);
let orderObject = [

  {
    objectId: "307-1",
    extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  },{
    objectId: "307-2",
    extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  },{
    objectId: "307-3",
    extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  },
  {
    objectId: "307-4",
    extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  },
  {
    objectId: "307-5",
    extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  },
  {
    objectId: "307-6",
    extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  },
  {
    objectId: "307-7",
    extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  },
  // {
  //   objectId: "307-8",
  //   extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  // },
  // {
  //   objectId: "307-9",
  //   extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  // },
  // {
  //   objectId: "307-10",
  //   extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  // },
  // {
  //   objectId: "307-11",
  //   extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  // },
  // {
  //   objectId: "307-12",
  //   extraData: { order_id: "AGI1234ca62549d", name: "Maffey Nada" },
  // }
];
client.events
  .book("agiball2022", orderObject)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  }); //[{objectId: "A1", extraData: {order_id: "123", name: "John"}}] 307,1,2,3,4,9,10,11,12
