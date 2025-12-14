const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27019/astra-invoicing';
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB bağlantı hatası: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
