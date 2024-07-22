const express = require('express');
const axios = require('axios');
// const dotenv = require('dotenv');
const { azureSendEmail } = require('./emailService'); // Assuming you have an azureSendEmail function in emailService.js

// dotenv.config();

const router = express.Router();
// const baseUrl = process.env.DRCHRONO_BASE_URL;
// const doctorId = parseInt(process.env.DOCTOR_ID);
const recipientEmails = process.env.RECIPIENT_EMAILS.split(',').concat([process.env.ENV_CLIENT_EMAIL]);




router.post('/Drchrono', async (req, res) => {
    const data = req.body;
    
    try {
        const headers = await createHeaders(); // Assuming createHeaders() is defined elsewhere
        headers['Content-Type'] = 'application/json';

        const { first_name, date_of_birth } = data;

        const drchronoApiResponse = await axios.get(`https://drchrono.com/api/patients?first_name=${first_name}&&date_of_birth=${date_of_birth}`, { headers });

        if (drchronoApiResponse.data.results.length > 0) {
            const patientsDatas = drchronoApiResponse.data.results[0];
            const oldPatientCreateData = {
                patient_id: patientsDatas.id,
                first_name: patientsDatas.first_name,
                last_name: patientsDatas.last_name,
                gender: patientsDatas.gender,
                cell_phone: patientsDatas.cell_phone,
                date_of_birth: patientsDatas.date_of_birth
            };

            return res.status(302).json({ status: 302, data: oldPatientCreateData });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, data: 'Internal Server Error' });
    }
});
