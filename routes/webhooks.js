var router = require("express").Router();
const crypto = require("crypto");

const seatsio = require("seatsio");
const getRawBody = require("raw-body");

router.post("/test-tyvent", async (req, res) => {
  /* ---------- Custom Vars ---------- */
  const secretKey = process.env.CLIENT_TESTTYVENT_SHOPIFYTOKEN;
  const ticketid = 6793446785093;
  const variant_adult = 40221816619077;
  const variant_youth = 40221816651845;

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
    var amount_adult = 0;
    var amount_youth = 0;

    order.line_items.forEach((element) => {
      if (element.product_id === ticketid) {
        // Es ist überprüft worden ob es überhaupt ein Ticket ist
        switch (element.variant_id) {
          case variant_adult:
            amount_adult = element.quantity;
            break;
          case variant_youth:
            amount_youth = element.quantity;
            break;
        }
      }
    });

    console.log("Jugend" + amount_youth);
    console.log("Erwachsen" + amount_adult);

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
