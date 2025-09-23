const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const seedsRoutes = require('./routes/seedsRoutes');
const cartRoutes = require('./routes/cartRoutes');
const fertilizersRoutes = require('./routes/fertilizersRoutes');
const cropListingRoutes = require('./routes/cropListingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const customerRoutes = require('./routes/customerRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

dotenv.config();

const app = express();

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());

// Mount routes early so they are available immediately
app.use('/api/auth', authRoutes);
app.use('/api/seeds', seedsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/fertilizers', fertilizersRoutes);
app.use('/api/crop-listings', cropListingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api', appointmentRoutes); // Keep appointments at /api first
app.use('/api/doctors', doctorRoutes); // Then doctors
app.use('/api/customers', customerRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Express server is running' });
});

// Connect to database (non-blocking for route availability)
connectToDatabase()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Please ensure MongoDB is running on your system');
    console.log('To install MongoDB, visit: https://www.mongodb.com/try/download/community');
    console.log('Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
  });

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


