const express = require('express');
const bcrypt = require('bcryptjs');
const AdminRegistration = require('../models/adminRegistration');
let jwt = require('jsonwebtoken');
const router = express.Router();

// Admin registration endpoint
router.post('/register', async (req, res) => {
    const { client_name, username, client_EMR, client_role, password } = req.body;

    try {
        // Check if the username already exists
        const existingAdmin = await AdminRegistration.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin
        const newAdmin = new AdminRegistration({
            client_name,
            username,
            client_EMR,
            client_role,
            password: hashedPassword
        });

        await newAdmin.save();
        res.status(200).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/login', async (req, res) => {

    const { username, password } = req.body;

    try {
        // Find the admin by username
        const admin = await AdminRegistration.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { adminId: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // The token will expire in 1 hour
        );

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
