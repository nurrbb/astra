const express = require('express');
const router = express.Router();
const {
  getAllInvoices,
  getInvoiceById,
  getInvoicesByUserId,
} = require('../controllers/invoiceController');

router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.get('/user/:userId', getInvoicesByUserId);

module.exports = router;

