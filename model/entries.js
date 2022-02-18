const mongoose = require("mongoose");
mongoose.set("debug", true);

const entrySchema = new mongoose.Schema({
  surname: { type: String },
  lastname: { type: String },
  entryTime: { type: Date },
});

module.exports = mongoose.model("entries", entrySchema);
