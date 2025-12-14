require('dotenv').config();
const express = require('express');
const errorHandler = require('./middlewares/error');
const { connectProducer, disconnectProducer } = require('./config/kafka');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Payment Service is running' });
});

app.use('/api/payments', require('./routes/paymentRoutes'));

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Connect Kafka producer on startup
connectProducer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await disconnectProducer();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await disconnectProducer();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Payment Service is running on port ${PORT}`);
});

