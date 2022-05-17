var router = require("express").Router();
const Blog = require("../model/blog");
const auth = require("../middleware/auth");
const crypto = require("crypto");
const secretKey = process.env.SHOPIFYKEY;
const seatsio = require("seatsio");
const getRawBody = require("raw-body");

router.post("/webhooks/orders/createw", async (req, res) => {
  console.log(req);
  console.log("🎉 We got an order!");
  console.log(secretKey);
  console.log(req.get("X-Shopify-Hmac-SHA256"));

  // We'll compare the hmac to our own hash
  const hmac = req.get("X-Shopify-Hmac-Sha256");
  console.log("rasw");
  // Use raw-body to get the body (buffer)
  const body = await getRawBody(req);
  console.log("desisdabody" + body);

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
    let client = new seatsio.SeatsioClient(
      seatsio.Region.EU(),
      process.env.SEATSIOKEY
    );
    await client.events.book("agiball2022", seatsArray);
    console.log("Phew, it came from Shopify!");
    res.sendStatus(200);
  } else {
    // No match! This request didn't originate from Shopify
    console.log("Danger! Not from Shopify!");
    res.sendStatus(403);
  }
});

router.post("/webhooks/orders/create", async (req, res) => {
  console.log("Webhook heard!");
  // Verify
  const hmac = req.header("X-Shopify-Hmac-Sha256");
  const topic = req.header("X-Shopify-Topic");
  const shop = req.header("X-Shopify-Shop-Domain");

  const verified = verifyWebhook(req.body, hmac);

  if (!verified) {
    console.log("Failed to verify the incoming request.");
    res.status(401).send("Could not verify request.");
    return;
  }

  const data = req.body.toString();
  const payload = JSON.parse(data);
  console.log(
    `Verified webhook request. Shop: ${shop} Topic: ${topic} \n Payload: \n ${data}`
  );

  res.status(200).send("OK");
});

// Verify incoming webhook.
function verifyWebhook(payload, hmac) {
  console.log("key" + process.env.SHOPIFYKEY);
  const message = payload.toString();
  const genHash = crypto
    .createHmac("sha256", process.env.SHOPIFYKEY)
    .update(message)
    .digest("base64");
  console.log(genHash);
  return genHash === hmac;
}

module.exports = router;
