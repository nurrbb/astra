const { sendMessage } = require('../config/kafka');

const processPayment = async (req, res, next) => {
  try {
    const { orderId, amount, userId, paymentMethod } = req.body;

    if (!orderId || !amount || !userId) {
      return res.status(400).json({
        success: false,
        code: 'PAY_003',
        message: 'Eksik ödeme bilgisi.',
      });
    }

    const paymentStatus = 'completed';
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const paymentData = {
      orderId,
      amount,
      userId,
      paymentMethod: paymentMethod || 'credit_card',
      transactionId,
      status: paymentStatus,
      timestamp: new Date().toISOString(),
    };

    try {
      await sendMessage('payment_completed', paymentData);
    } catch (kafkaError) {
      console.error('Kafka mesaj gönderme hatası:', kafkaError);
    }

    res.status(200).json({
      success: true,
      message: 'Ödeme işlendi',
      data: {
        transactionId,
        status: paymentStatus,
        orderId,
        amount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processPayment,
};
