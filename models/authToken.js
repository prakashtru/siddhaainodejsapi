const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthTokenSchema = new Schema({
    client_name: { type: String },
    client_emr: { type: String },
    session_token: { type: String },
    access_token: { type: String },
    short_token: { type: String },
    access_token_used: { type: Boolean, default: false },
    patient_id: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuthToken', AuthTokenSchema);