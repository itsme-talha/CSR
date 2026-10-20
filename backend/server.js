const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Environment variables load karna
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // JSON data receive karne ke liye
// Uploads folder ko public/static banana taake frontend files dekh sake
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Import
const authRoutes = require('./src/routes/authRoutes');
const beneficiaryRoutes = require('./src/routes/beneficiaryRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const campaignRoutes = require('./src/routes/campaignRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const publicRoutes = require('./src/routes/publicRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const messageRoutes = require('./src/routes/messageRoutes');

// API Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
// Test API Route
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'University Charity System API is successfully running!',
        version: '1.0'
    });
});

// Server Start Karna
// Server Start Karna
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is perfectly running on port ${PORT} (Network par accessible hai)`);
});