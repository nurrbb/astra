require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { connectDB, connectElasticsearch, getElasticsearchClient } = require('../config');

const indexAllProducts = async () => {
  try {
    await connectDB();
    await connectElasticsearch();

    const products = await Product.find({});
    const esClient = getElasticsearchClient();

    if (!esClient) {
      console.error('Elasticsearch client bulunamadı');
      process.exit(1);
    }

    console.log(`${products.length} ürün bulundu, indeksleniyor...`);

    const operations = products.flatMap((product) => [
      {
        index: {
          _index: 'products',
          _id: product._id.toString(),
        },
      },
      {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    ]);

    if (operations.length > 0) {
      const response = await esClient.bulk({ operations });
      
      if (response.errors) {
        const erroredDocuments = [];
        response.items.forEach((action, i) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              status: action[operation].status,
              error: action[operation].error,
              operation: operations[i * 2],
              document: operations[i * 2 + 1],
            });
          }
        });
        console.error('Hatalı dokümanlar:', erroredDocuments);
      } else {
        console.log(`Başarıyla ${products.length} ürün indekslendi`);
      }
    } else {
      console.log('İndekslenecek ürün bulunamadı');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('İndeksleme hatası:', error);
    process.exit(1);
  }
};

indexAllProducts();

