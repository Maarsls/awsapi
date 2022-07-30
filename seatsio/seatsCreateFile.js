const fs = require("fs");
const seatsio = require("seatsio");

async function main() {
  let client = new seatsio.SeatsioClient(
    seatsio.Region.EU(),
    "46f29735-c58a-4e29-ac31-c53279c28e80"
  );
  const resseat = await client.eventReports
    .byStatus("agiball2022", "booked")
    .catch((error) => {
      console.log(error);
    });

  resseat.booked.forEach((element) => {
    fs.appendFile(
      "sitze.txt",
      element.extraData.name + "," + element.label+"\n",
      (err) => {
        if (err) {
          console.error(err);
        }
        // done!
      }
    );
    console.log(element.extraData.name + "," + element.label);
  });
}

main();
