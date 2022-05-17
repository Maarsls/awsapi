var router = require("express").Router();
var verifyWebhook = require("verify-shopify-webhook")
const crypto = require("crypto");
const secretKey = process.env.SHOPIFYKEY;

router.post("/webhooks/orders/create", async (req, res) => {
  console.log("🎉 We got an order!");


  const { verified, topic, domain, body } = await verifyWebhook.verifyWebhook(
    req,
    secretKey
  );

  if (!verified) {
    return res.status(403).send();
  }

  req.body = body;
  console.log(req.body);
});

function verifyShopifyHook(req) {
  var digest = crypto
    .createHmac("SHA256", secretKey)
    .update(Buffer.alloc(req.body))
    .digest("base64");

  return digest === req.headers["X-Shopify-Hmac-Sha256"];
}
module.exports = router;
