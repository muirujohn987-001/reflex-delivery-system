require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/Auth-routes'); 
const { errorHandler, notFound } = require('./middleware/Errorhandler'); 

const app = express();
app.use(express.json());

// Mount Auth routes
app.use('/api/auth', authRoutes);[cite: 10]

// Centralized error handling (must be mounted after routes)[cite: 10]
app.use(notFound);[cite: 10]
app.use(errorHandler);[cite: 10]

app.listen(3000, () => console.log('Server running on port 3000'));