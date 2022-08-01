const mongoose = require("mongoose");
mongoose.set("debug", true);

const reportSchema = new mongoose.Schema({
  type: { type: String },
  value: { type: Number },
  event: { type: String },
});

module.exports = mongoose.model("report", reportSchema, "report");
