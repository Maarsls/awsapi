const mongoose = require("mongoose");
mongoose.set("debug", true);

const ordersSchema = new mongoose.Schema({
  orderId: { type: String },
  orderTime: { type: Date },
  customer: { email: { type: String }, nuuid: { type: String } },
  tickets: [{ uuid: { type: String } }],
});

module.exports = mongoose.model("orders", ordersSchema);
