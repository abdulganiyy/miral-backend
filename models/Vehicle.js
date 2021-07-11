const { Schema, model } = require("mongoose");

const vehicleSchema = new Schema({
  name: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  photos: [String],
  price: Number,
  type: String,
  maker: String,
  interiorColor: String,
  exteriorColor: String,
  yearBuilt: Date,
  condition: String,
  description: String,
  createdAt: Date,
});

module.exports = model("Vehicle", vehicleSchema);
