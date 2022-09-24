const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: { type: String },
    Mobile: String,
    name: String,
    email: String,
    password: String,
    userCart:Array,
    _created_at: Date,
    _updated_at: Date,
    

  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Users", userSchema, "Users");
