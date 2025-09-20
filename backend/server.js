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

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes early so they are available immediately
app.use('/api/auth', authRoutes);
app.use('/api/seeds', seedsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/fertilizers', fertilizersRoutes);
app.use('/api/crop-listings', cropListingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/transactions', transactionRoutes);

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
    console.error('Failed to connect to MongoDB', err);
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


