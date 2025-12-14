require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { startConsumer } = require('./config/kafka');
const errorHandler = require('./middlewares/error');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Invoicing Service is running' });
});

app.use('/api/invoices', require('./routes/invoiceRoutes'));

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

// Start Kafka consumer
startConsumer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Invoicing Service is running on port ${PORT}`);
});

