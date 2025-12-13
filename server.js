require('dotenv').config();
const express = require('express');
const { connectDB, connectRedis, connectElasticsearch } = require('./config');
const errorHandler = require('./middlewares/error');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
connectRedis();
connectElasticsearch();

app.get('/', (req, res) => {
  res.json({ message: 'Astra API çalışıyor' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
