const mongoose = require("mongoose");
mongoose.set("debug", true);

const seatsSchema = new mongoose.Schema({
  section: { type: String },
  table: { type: Number },
  seat: { type: Number },
  uniquekey: { type: String },
  family: { type: String },
  isBought: { type: Boolean },
});

module.exports = mongoose.model("seats", seatsSchema);
