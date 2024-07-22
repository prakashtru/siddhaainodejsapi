const express = require('express');
const axios = require('axios');
const {createHeaders} = require('../authSource/drchrono')
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
            const postData = {
                first_name: data.first_name,
                last_name: data.last_name,
                // doctor: doctorId,//doctor id want to take db
                gender: data.gender,
                cell_phone: data.cell_phone,
                date_of_birth: data.date_of_birth
            };

            const apiResponse = await axios.post(`https://drchrono.com/api/patients`, postData, { headers });

            if (apiResponse.status === 201) {
                const { id, first_name, last_name, gender, cell_phone, date_of_birth } = apiResponse.data;
                const newPatientCreateData = {
                    id,
                    first_name,
                    last_name,
                    gender,
                    cell_phone,
                    date_of_birth
                };

                azureSendEmail({
                    recipientEmails,//need to give hospital mail or doctor mail
                    subject: 'Welcome to Siddha AI - Patient Created',
                    body: `A New Patient was Added to DrChrono EHR.\nPatient ID: ${id}\nPatient Name: ${first_name} ${last_name}\nPlease Reach out to the patient for further details.`
                });

                return res.status(201).json({ status: 201, data: newPatientCreateData });
            } else {
                return res.status(400).json({ status: 400, data: 'Cannot Create the Patient at the moment. Try Again after sometime.' });
            }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, data: 'Internal Server Error' });
    }
});
