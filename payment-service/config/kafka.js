const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: process.env.KAFKA_BROKERS 
    ? process.env.KAFKA_BROKERS.split(',') 
    : ['localhost:9092'],
});

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka Producer bağlandı');
  } catch (err) {
    console.error('Kafka Producer bağlantı hatası:', err);
  }
};

const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    console.log('Kafka Producer bağlantısı kesildi');
  } catch (err) {
    console.error('Kafka Producer bağlantı kesme hatası:', err);
  }
};

const sendMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`${topic} topic'ine mesaj gönderildi:`, message);
    return { success: true };
  } catch (err) {
    console.error('Kafka mesaj gönderme hatası:', err);
    throw err;
  }
};

module.exports = {
  connectProducer,
  disconnectProducer,
  sendMessage,
};
