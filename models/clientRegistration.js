const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientRegistrationSchema = new Schema({
    client_firstName: { type: String, required: true },
    client_middleName: { type: String, required: false },
    client_lastName: { type: String, required: true },
    client_email: { type: String, required: true, unique: true },
    client_phone: { type: String, required: true },
    client_NPInumber: { type: String, required: true, unique: true },
    client_id: { type: String, required: true },
    client_secret: { type: String, required: true },
    client_EMR: { type: String, required: true },
    redirect_url: { type: String, required: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date }
});

module.exports = mongoose.model('ClientRegistration', ClientRegistrationSchema);
