const mongoose = require("mongoose");
mongoose.set("debug", true);

const blogSchema = new mongoose.Schema({
  event: { type: String },
  key: { iv: { type: String }, encryptedData: { type: String } },

});

module.exports = mongoose.model("events", blogSchema, "events");
