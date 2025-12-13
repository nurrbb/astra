const mongoose = require('mongoose');
const { getElasticsearchClient } = require('../config');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be a positive number'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image URL is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

productSchema.post('save', async function (doc) {
  try {
    const esClient = getElasticsearchClient();
    if (!esClient) {
      return;
    }

    await esClient.index({
      index: 'products',
      id: doc._id.toString(),
      document: {
        name: doc.name,
        description: doc.description,
        price: doc.price,
        imageUrl: doc.imageUrl,
        category: doc.category,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
    });
  } catch (err) {
    console.error('Elasticsearch indeksleme hatası:', err.message);
  }
});

productSchema.post('findOneAndUpdate', async function (result) {
  try {
    if (!result) return;
    
    const esClient = getElasticsearchClient();
    if (!esClient) {
      return;
    }

    await esClient.index({
      index: 'products',
      id: result._id.toString(),
      document: {
        name: result.name,
        description: result.description,
        price: result.price,
        imageUrl: result.imageUrl,
        category: result.category,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    });
  } catch (err) {
    console.error('Elasticsearch güncelleme hatası:', err.message);
  }
});

productSchema.post('findOneAndDelete', async function (doc) {
  try {
    if (!doc) return;
    
    const esClient = getElasticsearchClient();
    if (!esClient) {
      return;
    }

    await esClient.delete({
      index: 'products',
      id: doc._id.toString(),
    });
  } catch (err) {
    console.error('Elasticsearch silme hatası:', err.message);
  }
});

module.exports = mongoose.model('Product', productSchema);

