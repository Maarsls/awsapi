var router = require("express").Router();
const getRawBody = require("raw-body");
const crypto = require("crypto");
const secretKey = process.env.SHOPIFYKEY;

router.post("/webhooks/orders/create", async (req, res) => {
  console.log("🎉 We got an order!");

  if (verifyShopifyHook(req)) {
    res.writeHead(200);
    res.end("Verified webhook");
  } else {
    res.writeHead(401);
    res.end("Unverified webhook");
  }
});

function verifyShopifyHook(req) {
  var digest = crypto
    .createHmac("SHA256", secretKey)
    .update(new Buffer(req.body, "utf8"))
    .digest("base64");

  return digest === req.headers["X-Shopify-Hmac-Sha256"];
}
module.exports = router;
