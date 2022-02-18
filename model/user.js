const mongoose = require("mongoose");
mongoose.set("debug", true);

const userSchema = new mongoose.Schema({
  nuuid: { type: String },
  role: { type: String },
});

module.exports = mongoose.model("user", userSchema, "user");
