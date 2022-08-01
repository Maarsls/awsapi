const seatsio = require("seatsio");


let client = new seatsio.SeatsioClient(
    seatsio.Region.EU(),
    "46f29735-c58a-4e29-ac31-c53279c28e80"
);
async function main() {
    const resseat = await client.eventReports
        .byStatus("test-tyvent", "booked")
        .catch((error) => {
            console.log(error);
        });
    console.log(resseat.booked);
}
main();