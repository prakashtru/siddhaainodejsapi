const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
let fs = require("fs");
let jwt = require('jsonwebtoken');

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
}
// console.log('MongoDB URI:', mongoUri);
// Configuration for the database
const config = {
    database: mongoUri
};

// const config = {
//     database: 'mongodb://localhost:27017/siddhaai'
// };

// console.log("config==>",config);
// Connect to MongoDB using Mongoose
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected successfully to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// Middleware
app.use(express.json()); // For parsing application/json

// Require the models
const AuthToken = require('./models/authToken');
const ClientRegistration = require('./models/clientRegistration');
const MonthlyReport = require('./models/monthlyReports');
const AdminRegistration = require('./models/adminRegistration');
const AdminOtp = require('./models/adminOtpModel');

// Use the client registration router
const clientRegistrationRouter = require('./routes/clientRegistry/clientregistration');
app.use('/clientregistration', clientRegistrationRouter);
const adminRegistrationRouter = require('./routes/adminPortal/adminregistration')
app.use('/adminregistration', adminRegistrationRouter);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
