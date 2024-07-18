let express = require('express');
let router = express.Router();
let axios = require('axios')
let clientRegistration = require('../../models/clientRegistration');
const dotenv = require('dotenv');
const { URLSearchParams } = require('url');
//let base_url = "https://drchrono.com"

const base_url = process.env.BASE_URL;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;



router.post('/', async (req, res) => {
    const { client_firstName, client_lastName, client_phone, client_email, client_NPInumber, client_secret, client_id, client_EMR } = req.body;

    try {
        // Fetch NPI data from the API
        const response = await axios.get(`https://npiregistry.cms.hhs.gov/api/?number=${client_NPInumber}&version=2.1`);
        const npiData = response.data;
        console.log(npiData.results[0].basic, "NPI")
        if (npiData.result_count > 0) {
            const status = npiData.results[0].basic.status;
            const client_FirstName = npiData.results[0].basic.first_name;
            const client_LastName = npiData.results[0].basic.last_name;

            if (client_firstName.toLowerCase() === client_FirstName.toLowerCase() && client_lastName.toLowerCase() === client_LastName.toLowerCase()) {
                // NPI verification successful, proceed with client registration
                const newClient = new clientRegistration({
                    client_firstName,
                    client_lastName,
                    client_phone,
                    client_email,
                    client_NPInumber,
                    client_EMR,
                    client_id,
                    client_secret
                });

                await newClient.save();

                res.status(201).json({
                    success: true,
                    message: "Client registration successful",
                    data: newClient
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Name mismatch"
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: "No results found for the given NPI Number."
            });
        }
    } catch (error) {
        console.error("Error fetching NPI data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch NPI data",
            error: error.message
        });
    }
});



// Route to initiate OAuth2 flow
// router.get('/auth', (req, res) => {
//     const authUrl = `${base_url}/o/authorize/?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
//     console.log(authUrl);
//     res.redirect(authUrl);
// });




// router.post('/token', async (req, res) => {
//     const { code, CLIENT_IDs, CLIENT_SECRETs, REDIRECT_URIs, grant_type } = req.body;

//     // Validate parameters
//     // if (!code) {
//     //     return res.status(400).json({ error: 'Missing required parameters' });
//     // }

//     try {
//         // Make POST request to token endpoint
//         const tokenResponse = await axios.post('https://drchrono.com/o/token/', qs.stringify({
//             client_id: client_id,
//             client_secret: client_secret,
//             redirect_uri: redirect_uri,
//             code: code,
//             grant_type: grant_type
//         }), {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//         });
//         console.log("tokenResponse==>", tokenResponse);
//         console.log("tokenResponse.data==>", tokenResponse.data);
//         // Handle successful response
//         res.json(tokenResponse.data);

//     } catch (error) {
//         // Handle error
//         console.error('Token exchange error:', error.response ? error.response.data : error.message);
//         res.status(500).json({ error: 'Failed to obtain tokens' });
//     }
// });
// //const tokenResponse = await axios.post(tokenEndpoint, tokenParams.toString(), {


// // Handle successful response

// // Endpoint to handle the redirect and capture the authorization code
// router.get('/callback', async (req, res) => {
//     // const { code } = req.query;

//     // if (!code) {
//     //     return res.status(400).json({ error: 'Authorization code not found' });
//     // }

//     try {
//         // OAuth token endpoint URL
//         const tokenEndpoint = `${base_url}/o/token/`;
//         console.log("Token Endpoint:", tokenEndpoint);

//         // Parameters required for authorization code grant type
//         const tokenParams = new URLSearchParams({
//             grant_type: 'authorization_code',
//             code: "tZ8xmiV8wo7yRXvUR6rdndSgBy3X2l", // Use the authorization code obtained from the OAuth server
//             client_id: '4AlEU4XV2O5PyCZ129XfWboYJFUFM5hIgUwYnabG',// Replace with your actual client ID
//             client_secret: 'CyTb13kTmDgJ7on7t9x3LzCR0EKnBsDP0KqqLueNuxH01cyQpTqmgEFfrENa1zMY0d2Iv0OkdtCNbmVwnJp43USUpTaCrFwMjwIV7eXkfN9SwTq1YwOz9ARR9HNQ7UBw',// Replace with your actual client secret
//             redirect_uri: 'https://siddhaai-demo-api.blueswype.in/auth/callback'

//         });

//         console.log("Token Params:", tokenParams.toString());

//         // Make a POST request to the token endpoint with client credentials
//         const tokenResponse = await axios.post(tokenEndpoint, tokenParams.toString(), {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//         });

//         // If successful, respond with a success message or token details
//         res.json({ valid: true, data: tokenResponse.data });
//     } catch (error) {
//         // Log detailed error information
//         console.error('Error Response:', error.response?.data || error.message);

//         // Respond with detailed error message
//         res.status(400).json({ valid: false, error: error.response?.data || error.message });
//     }
// });

module.exports = router;






