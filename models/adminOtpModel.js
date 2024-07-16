const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminOtpSchema = new Schema({
  client_name: { type: String },
  client_EMR: { type: String },
  client_role: { type: String },
  otp: { type: Number },
  otp_validity: { type: Number },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminOtp', AdminOtpSchema);
