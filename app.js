require("dotenv").config();
require("./config/database").connect();
const express = require("express");

const app = express();

app.use(express.json());

app.use("/entries", require("./routes/entries"));
app.use("/tickets", require("./routes/tickets"));
app.use("/partner", require("./routes/partner"));
app.use("/user", require("./routes/user"));
app.use("/orders", require("./routes/orders"));
app.use("/blog", require("./routes/blog"));
app.use("/", require("./routes/main"));

module.exports = app;
