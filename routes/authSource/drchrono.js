const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const qs = require('qs');
const { MongoClient } = require('mongodb');

dotenv.config();

const app = express();
const router = express.Router();
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const recipientEmails = process.env.RECIPIENT_EMAILS.split(',').concat([process.env.ENV_CLIENT_EMAIL]);

async function fetchTokenFromDB() {
    await client.connect();
    const database = client.db('your_db_name');
    const tokens = database.collection('tokens');
    const tokenData = await tokens.findOne({}); // Adjust your query as needed
    await client.close();
    return tokenData;
}

async function updateTokenInDB(newTokenData) {
    await client.connect();
    const database = client.db('your_db_name');
    const tokens = database.collection('tokens');
    await tokens.updateOne({}, { $set: { ...newTokenData, createdAt: new Date() } }, { upsert: true }); // Adjust your query as needed
    await client.close();
}

async function refreshAccessToken(refreshToken) {
    try {
        const response = await axios.post('https://drchrono.com/o/token/', qs.stringify({
            'refresh_token': refreshToken,
            'grant_type': 'refresh_token',
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const data = response.data;
        console.log('New access token:', data.access_token);
        return data;
    } catch (error) {
        console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getToken() {
    const tokenData = await fetchTokenFromDB();
    const tokenAgeInHours = (Date.now() - new Date(tokenData.createdAt).getTime()) / 36e5;
    
    if (tokenAgeInHours >= 46) {
        const newTokenData = await refreshAccessToken(tokenData.refresh_token);
        await updateTokenInDB(newTokenData);
        return newTokenData.access_token;
    } else {
        return tokenData.access_token;
    }
}

async function createHeaders() {
    const token = await getToken();
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    return headers;
}

router.get('/oauth', (req, res) => {
    const { redirect_uri, client_id, response_type } = req.query;

    console.log("client_id ==>", process.env.CLIENT_ID);

    const authUrl = `https://drchrono.com/o/authorize/?redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=${"code"}&client_id=${process.env.CLIENT_ID}`;
    console.log("authUrl", authUrl);
    res.redirect(authUrl);
});

router.get('/callback', (req, res) => {
    console.log('Request query:', req.query);
    const { code } = req.query;
    console.log(code);
    res.redirect(`token?code=${encodeURIComponent(code)}`);
});

router.get('/token', async (req, res) => {
    const { code } = req.query;
    console.log("code==>", code);

    try {
        const tokenResponse = await axios.post(`${process.env.BASE_URL}/o/token/`, qs.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI,
            code: code,
            grant_type: "authorization_code"
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        console.log("tokenResponse:", tokenResponse);
        console.log("tokenResponse.data:", tokenResponse.data);

        // Store the token data with the createdAt timestamp
        await updateTokenInDB({ ...tokenResponse.data, createdAt: new Date() });

        // Handle successful response
        res.json(tokenResponse.data);
    } catch (error) {
        // Handle error
        console.error('Token exchange error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to obtain tokens' });
    }
});

router.get('/refreshtoken', async (req, res) => {
    try {
        const tokenData = await fetchTokenFromDB();
        const newTokenData = await refreshAccessToken(tokenData.refresh_token);
        await updateTokenInDB(newTokenData);

        res.json(newTokenData);
    } catch (error) {
        console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
});

module.exports = router;
