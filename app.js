require("dotenv").config();
require("./config/database").connect();
const cors = require("cors");
const express = require("express");

const app = express();

// app.use(cors());

// app.use(express.json({ limit: "50mb" }));

app.use("/entries", require("./routes/entries"));
app.use("/tickets", require("./routes/tickets"));
app.use("/partner", require("./routes/partner"));
app.use("/user", require("./routes/user"));
app.use("/orders", require("./routes/orders"));
app.use("/blog", require("./routes/blog"));
app.use("/seats", require("./routes/seats"));
app.use("/pdf", require("./routes/pdf"));
app.use("/qr", require("./routes/qr"));
app.use("/", require("./routes/main"));
app.use("/shopify", require("./routes/shopify"));
app.use("/webhooks", require("./routes/webhooks"));


//FÜR EVENTS
app.use("/shopify/test-tyvent", require("./routes/shopifyR/test-tyvent")); // für jedes event wird eine route angelegt

module.exports = app;
