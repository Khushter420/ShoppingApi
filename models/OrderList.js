const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderlistSchema = new Schema(
  {
    _id: { type: String },
    productCode: String,
    userMobile: String,
    quantity: Number,
    orderStatus: String,
    _created_at: Date,
    _updated_at: Date,
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("OrderList", orderlistSchema, "OrderList");
