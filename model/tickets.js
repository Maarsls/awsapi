const mongoose = require("mongoose");
mongoose.set("debug", true);

const ticketsSchema = new mongoose.Schema({
  uuid: { type: String },
  activationTime: { type: Date },
  status: { type: String },
  type: { type: String },
  customer: { type: String },
  issuer: { type: String },
});

module.exports = mongoose.model("tickets", ticketsSchema);
