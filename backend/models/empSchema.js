const mongoose = require("mongoose");

const empSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: Number,
  department: String,
});

module.exports = mongoose.model("employee", empSchema);
