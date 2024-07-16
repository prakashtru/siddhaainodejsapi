const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MonthlyReportSchema = new Schema({
    client_id: { type: String, required: true },
    report_data: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MonthlyReport', MonthlyReportSchema);
