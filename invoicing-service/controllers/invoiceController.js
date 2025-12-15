const Invoice = require('../models/Invoice');

const createInvoice = async (paymentData) => {
  try {
    const { orderId, amount, userId, transactionId, paymentMethod, status } = paymentData;
    const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const invoice = await Invoice.create({
      invoiceId,
      orderId,
      userId,
      amount,
      transactionId,
      paymentMethod: paymentMethod || 'credit_card',
      status: status || 'completed',
      date: new Date(),
    });

    console.log(`Fatura oluşturuldu: ${invoiceId} - Sipariş: ${orderId}`);
    return invoice;
  } catch (err) {
    console.error('Fatura oluşturma hatası:', err);
    throw err;
  }
};

const getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Faturalar getirildi',
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        code: 'INV_001',
        message: 'Fatura bulunamadı.',
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        code: 'INV_001',
        message: 'Fatura bulunamadı.',
      });
    }
    next(error);
  }
};

const getInvoicesByUserId = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ userId: req.params.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Kullanıcı faturaları getirildi',
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  getInvoicesByUserId,
};
