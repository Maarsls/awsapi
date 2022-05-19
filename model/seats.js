const mongoose = require("mongoose");
mongoose.set("debug", true);

const seatsSchema = new mongoose.Schema({
  seats: { type: Array },
  family: { type: String },
});

module.exports = mongoose.model("seats", seatsSchema);
