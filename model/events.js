const mongoose = require("mongoose");
mongoose.set("debug", true);

const blogSchema = new mongoose.Schema({
  event: { type: String },
});

module.exports = mongoose.model("events", blogSchema, "events");
