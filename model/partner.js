const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  surname: { type: String },
  lastname: { type: String },
  school: { type: String },
  information: { type: String },
  longitude: { type: Number },
  latitude: { type: Number },
});

module.exports = mongoose.model("partner", partnerSchema, "partner");
