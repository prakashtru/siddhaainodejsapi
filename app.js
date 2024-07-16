const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
let fs = require("fs");
let jwt = require('jsonwebtoken');

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

// Configuration for the database
const config = {
    database: 'mongodb://localhost:27017/siddaai'
};

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
const clientRegistrationRouter = require('./routes/clientregistration');
const adminRegistrationRouter = require('./routes/adminregistration')
app.use('/clientregistration', clientRegistrationRouter);
app.use('/adminregistration', adminRegistrationRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
