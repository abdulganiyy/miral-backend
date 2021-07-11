const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: String,
  email: String,
  photo: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: String,
  createdAt: Date,
});

module.exports = model("User", userSchema);
