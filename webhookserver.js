const express = require("express");
require("dotenv").config();
const app = express();
const getRawBody = require("raw-body");
const crypto = require("crypto");
const secretKey = process.env.SHOPIFYKEY;
const seatsio = require("seatsio");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/shopify/webhooks/orders/create", async (req, res) => {
  console.log("🎉 We got an order!");

  // We'll compare the hmac to our own hash
  const hmac = req.get("X-Shopify-Hmac-Sha256");

  // Use raw-body to get the body (buffer)
  const body = await getRawBody(req);

  // Create a hash using the body and our key
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(body, "utf8", "hex")
    .digest("base64");

  // Compare our hash to Shopify's hash
  if (hash === hmac) {
    // It's a match! All good
    console.log("Phew, it came from Shopify!");
    console.log("job done");
    const order = JSON.parse(body.toString());
    if (order.note) {
      let seatsArray = [];
      let orderNote = order.note;
      const noWhitespace = orderNote.replace(/\s/g, "");
      seatsArray = noWhitespace.split(",");
      let holdToken = seatsArray.pop();
      console.log(seatsArray);
      let orderObject = [];
      seatsArray.forEach((seat) => {
        orderObject.push({objectId: seat, extraData: {order_id: order.id, name: order.customer.last_name}});
      });
      // It's a match! All good
      let client = new seatsio.SeatsioClient(
        seatsio.Region.EU(),
        process.env.SEATSIOKEY
      );
      console.log(orderObject);
      await client.events.book("agiball2022", {objects: orderObject, holdToken});
    }
    console.log("Phew, it came from Shopify!");
    res.sendStatus(200);
  } else {
    // No match! This request didn't originate from Shopify
    console.log("Danger! Not from Shopify!");
    res.sendStatus(403);
  }
});
// Dependencies
const fs = require("fs");
const http = require("http");
const https = require("https");
const seats = require("./model/seats");
// Certificate
const privateKey = fs.readFileSync(
  process.cwd() + "/etc/letsencrypt/live/tyvent.at/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  process.cwd() + "/etc/letsencrypt/live/tyvent.at/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  process.cwd() + "/etc/letsencrypt/live/tyvent.at/chain.pem",
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

// Starting both http & https servers
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(443, () => {
  console.log("HTTPS Server running on port 443");
});
