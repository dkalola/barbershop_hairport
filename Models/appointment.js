const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: mongoose.Types.ObjectId,
  },
  guestID: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  checkedIn: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: Number,
    default: 0.0,
  },
  payed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
