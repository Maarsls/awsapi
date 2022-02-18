const mongoose = require("mongoose");
mongoose.set("debug", true);

const blogSchema = new mongoose.Schema({
  markdown: { type: String },
  entryDate: { type: Date },
  description: { type: String },
  author: { type: String },
});

module.exports = mongoose.model("blog", blogSchema, "blog");
