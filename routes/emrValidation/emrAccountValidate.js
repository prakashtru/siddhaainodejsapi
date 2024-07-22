const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');

const CLIENT_ID = '4AlEU4XV2O5PyCZ129XfWboYJFUFM5hIgUwYnabG'; // Replace with your actual client ID

const CLIENT_SECRET = 'CyTb13kTmDgJ7on7t9x3LzCR0EKnBsDP0KqqLueNuxH01cyQpTqmgEFfrENa1zMY0d2Iv0OkdtCNbmVwnJp43USUpTaCrFwMjwIV7eXkfN9SwTq1YwOz9ARR9HNQ7UBw'; // Replace with your actual client secret

// const REDIRECT_URI = 'https://siddhaai-demo-api.blueswype.in/auth/callback'; // Replace with your actual redirect URI
const REDIRECT_URI = 'http://localhost:5000/auth/callback'; // Replace with your actual redirect URI

const base_url = 'https://drchrono.com';

router.get('/oauth', (req, res) => {
  const { redirect_uri, client_id, response_type } = req.query;

  // // Validate parameters
//   if (!redirect_uri || !client_id || !response_type) {
//       return res.status(400).json({ error: 'Missing required parameters' });
//   }
  // Validate client_id (optional, depending on your application's needs)
  // Construct the authorization URL
  const authUrl = `https://drchrono.com/o/authorize/?redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${"code"}&client_id=${CLIENT_ID}`;

  // Redirect the user to DrChrono authorization page
  console.log("authUrl",authUrl);
  res.redirect(authUrl);

//   res.send(authUrl)
});

router.get('/callback', (req, res) => {
    console.log('Request query:', req.query); // Log the full request query object
    const { code } = req.query;
    // if (!code) {
    //     return res.status(400).json({ error: 'Authorization code not provided' });
    // }
    console.log(code);
    // Redirect to the token route with the authorization code
    res.redirect(`token?code=${encodeURIComponent(code)}`);
  });

  router.get('/token', async (req, res) => {
    const { code } = req.query;
    console.log("code==>",code);
    const { client_id = CLIENT_ID, client_secret = CLIENT_SECRET, redirect_uri = REDIRECT_URI, grant_type = "authorization_code" } = req.query;
  
    // Validate parameters
    if (!code || !client_id || !client_secret || !redirect_uri || !grant_type) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }
  
    try {
        // Make POST request to token endpoint with proper form encoding
        const tokenResponse = await axios.post(`${base_url}/o/token/`, qs.stringify({
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: redirect_uri,
            code: code,
            grant_type: grant_type
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
  
        console.log("tokenResponse:", tokenResponse);
        console.log("tokenResponse.data:", tokenResponse.data);
  
        // Handle successful response
        res.json(tokenResponse.data);
    } catch (error) {
        // Handle error
        console.error('Token exchange error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to obtain tokens' });
    }
  });

  module.exports = router;
