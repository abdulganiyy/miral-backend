const { Schema, model } = require("mongoose");

const propertySchema = new Schema({
  name: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  city: String,
  state: String,
  country: String,
  postalCode: Number,
  photos: [String],
  price: Number,
  rooms: Number,
  baths: Number,
  yearBuilt: Date,
  condition: String,
  propertyType: String,
  description: String,
  createdAt: Date,
  latitude: Number,
  longitude: Number,
});

module.exports = model("Property", propertySchema);
