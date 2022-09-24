const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    _id: { type: String },
    productCode: String,
    productName: String,
    quantity: Number,
    brandName: String,
    prize:String,
    _created_at: Date,
    _updated_at: Date,
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Product_Details", productSchema, "Product_Details");
