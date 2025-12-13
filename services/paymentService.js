const axios = require('axios');

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:5001';

const processPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${PAYMENT_SERVICE_URL}/api/payments/process`,
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Ödeme servisi hatası:', error.message);
    
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || 'Ödeme işlemi başarısız',
        statusCode: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'Ödeme servisi kullanılamıyor',
        statusCode: 503,
      };
    } else {
      return {
        success: false,
        error: error.message || 'Ödeme işlemi başarısız',
        statusCode: 500,
      };
    }
  }
};

module.exports = {
  processPayment,
};

