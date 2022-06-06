require("dotenv").config();
const seatsio = require("seatsio");

let client = new seatsio.SeatsioClient(
  seatsio.Region.EU(),
  process.env.SEATSIOKEY
);
const resseat = await client.eventReports.byAvailability('agiball2022')
  let result = [];
  // console.log(resseat);
  resseat.not_available.forEach(element => {
    result.push({label: element.label, extraData: element.extraData})
  });
  console.log(result);
