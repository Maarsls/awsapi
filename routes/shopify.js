var router = require("express").Router();
const Blog = require("../model/blog");
const auth = require("../middleware/auth");
const crypto = require("crypto");
const secretKey = process.env.SHOPIFYKEY;
const seatsio = require("seatsio");
const getRawBody = require("raw-body");

router.post("/webhooks/orders/create", async (req, res) => {
  console.log("🎉 We got an order!");
  console.log(secretKey);
  console.log(req.get("X-Shopify-Hmac-SHA256"));

  // We'll compare the hmac to our own hash
  const hmac = req.get("X-Shopify-Hmac-Sha256");
  console.log("rasw");
  // Use raw-body to get the body (buffer)
  const body = await getRawBody(req);
  console.lof(body);

  // Create a hash using the body and our key
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(body, "utf8", "hex")
    .digest("base64");

  console.log(hash + " " + hmac);

  // Compare our hash to Shopify's hash
  if (hash === hmac) {
    console.log("job done");
    const order = JSON.parse(body.toString());
    let seatsArray = [];
    let orderNote = order.note;
    const noWhitespace = orderNote.replace(/\s/g, "");
    seatsArray = noWhitespace.split(",");
    seatsArray.pop();
    console.log(seatsArray);
    // It's a match! All good
    // let client = new seatsio.SeatsioClient(
    //   seatsio.Region.EU(),
    //   process.env.SEATSIOKEY
    // );
    // await client.events.book("agiball2022", seatsArray);
    console.log("Phew, it came from Shopify!");
    res.sendStatus(200);
  } else {
    // No match! This request didn't originate from Shopify
    console.log("Danger! Not from Shopify!");
    res.sendStatus(403);
  }
});

module.exports = router;
