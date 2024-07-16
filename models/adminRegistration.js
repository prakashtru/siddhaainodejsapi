const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminRegistrationSchema = new Schema({
    client_name: { type: String },
    username: { type: String },
    client_EMR: { type: String },
    client_role: { type: String },
    client_NPInumber: { type: String },
    //email: { type: String, required: true, unique: true },
    password: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminRegistration', AdminRegistrationSchema);
