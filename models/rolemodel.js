const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    client_name: { type: String },
    roletype: { type: String },
    client_EMR: { type: String },
    client_role: { type: String },
    //email: { type: String, required: true, unique: true },
    //password: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', RoleSchema);
