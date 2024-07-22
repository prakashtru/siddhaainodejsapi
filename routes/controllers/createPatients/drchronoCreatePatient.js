const axios = require('axios');
const { createHeaders, azureSendEmail } = require('./utils'); // Assuming these utilities are defined elsewhere

async function drchronoPatientCreate(data) {
    try {
        const headers = await createHeaders();
        headers['Content-Type'] = 'application/json';

        const postData = {
            first_name: data.first_name,
            last_name: data.last_name,
            gender: data.gender,
            cell_phone: data.cell_phone,
            date_of_birth: data.date_of_birth
        };

        const apiResponse = await axios.post('https://drchrono.com/api/patients', postData, { headers });

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

            await azureSendEmail({
                recipientEmails,
                subject: 'Welcome to Siddha AI - Patient Created',
                body: `A New Patient was Added to DrChrono EHR.\nPatient ID: ${id}\nPatient Name: ${first_name} ${last_name}\nPlease Reach out to the patient for further details.`
            });

            return { status: 201, data: newPatientCreateData };
        } else {
            return { status: 400, data: 'Cannot Create the Patient at the moment. Try Again after sometime.' };
        }
    } catch (error) {
        console.error(error);
        return { status: 500, data: 'Internal Server Error' };
    }
}
