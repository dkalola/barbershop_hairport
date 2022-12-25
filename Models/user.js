const mongoose = require("mongoose");

// const apiKey = new mongoose.Schema({
//   key: { type: String },
//   date: { type: Date, default: Date.now },
// });

const dateTimeRange = new mongoose.Schema({
  timeStart: { type: Date },
  timeEnd: { type: Date },
});

const appointmentDF = new mongoose.Schema({
  slotSize: { type: Number },
  dateTimeRange: [dateTimeRange],
});

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  apiKey: { type: String, default: "" },
  name: { type: String, default: "" },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  reqCountCurrent: { type: Number, required: true, default: 0 },
  reqCountMax: { type: Number, required: true, default: 0 },
  statusCode: { type: Number, required: true, default: -1 }, // 0 = Haulted, -1 = Unsubscribed, 1 = Bronze, 2 = Silver, 3 = Platinum
  subStartDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  subEndDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  slotSize: { type: Number, default: 0, required: true },
  dateTimeRange: [],
});

module.exports = mongoose.model("User", userSchema);
