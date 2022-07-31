var router = require("express").Router();
const crypto = require("crypto");

const seatsio = require("seatsio");
const getRawBody = require("raw-body");

router.post("/test-tyvent", async (req, res) => {
  /* ---------- Custom Vars ---------- */
  const secretKey = process.env.CLIENT_TESTTYVENT_SHOPIFYTOKEN;
  const ticketid = 6793446785093;

  /* ---------- End Custom Vars ----------*/
  console.log("🎉 We got an order!");

  const hmac = req.get("X-Shopify-Hmac-Sha256");
  const body = await getRawBody(req);

  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(body, "utf8", "hex")
    .digest("base64");

  if (hash === hmac) {
    const order = JSON.parse(body.toString());
    console.log(order);

    /* ---------- Seats.io ---------- */
    // let seatsArray = [];
    // let orderNote = order.note;
    // const noWhitespace = orderNote.replace(/\s/g, "");
    // seatsArray = noWhitespace.split(",");
    // seatsArray.pop();
    // console.log(seatsArray);
    // It's a match! All good
    // let client = new seatsio.SeatsioClient(
    //   seatsio.Region.EU(),
    //   process.env.SEATSIOKEY
    // );
    // await client.events.book("agiball2022", seatsArray);
    /* ---------- End Seats.io ---------- */

    /* ---------- Qr Tickets ---------- */

    order.line_items.forEach((element) => {
      if (element.id === ticketid) {
        // Es ist überprüft worden ob es überhaupt ein Ticket ist
        console.log(element.title + " " + element.quantity);
      }
    });

    /* ---------- End Qr Tickets ---------- */

    console.log("Phew, it came from Shopify!");
    res.sendStatus(200);
  } else {
    // No match! This request didn't originate from Shopify
    console.log("Danger! Not from Shopify!");
    res.sendStatus(403);
  }
});

module.exports = router;
