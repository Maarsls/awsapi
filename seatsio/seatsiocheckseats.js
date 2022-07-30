require("dotenv").config();
const seatsio = require("seatsio");
var sqlite3 = require("sqlite3");

let db = new sqlite3.Database(
  "./shopify.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.log("Getting error " + err);
      exit(1);
    }
    runQueries(db);
  }
);

async function runQueries(db) {
  let shopifyorder = db.all(
    `select Notes, billing_name from orders WHERE Notes != ""`,
    async (err, rows) => {
      // rows.forEach((row) => {
      //   console.log(row);
      // });
      console.log(process.env.SEATSIOKEY);
      let client = new seatsio.SeatsioClient(
        seatsio.Region.EU(),
        "46f29735-c58a-4e29-ac31-c53279c28e80"
      );
      const resseat = await client.eventReports
        .byStatus("agiball2022", "booked")
        .catch((error) => {
          console.log(error);
        });
      // console.log(resseat.booked);
      let cleanedSeats = [];
      resseat.booked.forEach((one) => {
        try {
          if (one.extraData.name) cleanedSeats.push(one);
        } catch (error) {
          console.log(error);
        }
        // console.log(one);
      });
      rows.forEach(async (row) => {
        // console.log(row.billing_name);
        let billing_name = row.billing_name;
        if (row.billing_name.split(" ").length > 1)
          billing_name = row.billing_name.split(" ").slice(-1)[0];
        // console.log(billing_name);

        console.log(
          billing_name +
            " " +
            "laenge" +
            (row.Notes.split(",").length - 1) +
            " " +
            cleanedSeats.filter((one) => one.extraData.name == billing_name)
              .length
        );
      });
    }
  );
  // let client = new seatsio.SeatsioClient(
  //   seatsio.Region.EU(),
  //   process.env.SEATSIOKEY
  // );
  // const resseat = await client.eventReports.byAvailability("agiball2022");

  // resseat.not_available.filter((one) => one.category.label == singleType.type);
  // console.log(result);
}
