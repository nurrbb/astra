const { Kafka } = require('kafkajs');
const { createInvoice } = require('../controllers/invoiceController');

const kafka = new Kafka({
  clientId: 'invoicing-service',
  brokers: process.env.KAFKA_BROKERS 
    ? process.env.KAFKA_BROKERS.split(',') 
    : ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'invoicing-service-group' });

const startConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Kafka Consumer bağlandı');

    await consumer.subscribe({ 
      topic: 'payment_completed',
      fromBeginning: false 
    });

    console.log('payment_completed topic\'ine abone olundu');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const paymentData = JSON.parse(message.value.toString());
          console.log(`${topic} topic'inden mesaj alındı:`, paymentData);
          await createInvoice(paymentData);
        } catch (err) {
          console.error('Kafka mesaj işleme hatası:', err);
        }
      },
    });
  } catch (err) {
    console.error('Kafka Consumer başlatma hatası:', err);
  }
};

module.exports = {
  startConsumer,
};
