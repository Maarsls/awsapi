var router = require("express").Router();
const crypto = require("crypto");
const secretKey = process.env.SHOPIFYKEY;

var bodyparser = require("body-parser");
router.use(bodyparser.raw({ type: "application/json" }));

// Webhooks
router.post("/", async (req, res) => {
  console.log("Webhook heard!");
  // Verify
  const hmac = req.header("X-Shopify-Hmac-Sha256");
  const topic = req.header("X-Shopify-Topic");
  const shop = req.header("X-Shopify-Shop-Domain");

  console.log(shop + " " + topic);

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
  const message = payload.toString();
  const genHash = crypto
    .createHmac("sha256", process.env.SHOPIFYKEY)
    .update(message)
    .digest("base64");
  console.log(genHash + " " + hmac);

  return genHash === hmac;
}

module.exports = router;
