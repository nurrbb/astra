const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true,
    unique: true,
  },
  orderId: {
    type: String,
    required: [true, 'Order ID is required'],
    index: true,
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number'],
  },
  transactionId: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: 'credit_card',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Invoice', invoiceSchema);

