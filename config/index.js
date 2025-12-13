const mongoose = require('mongoose');
const { createClient } = require('redis');
const { Client } = require('@elastic/elasticsearch');

let redisClient = null;
let elasticsearchClient = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27019/astra';
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

const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6380';
    redisClient = createClient({ url: redisUrl });

    redisClient.on('error', (err) => console.error('Redis hatası:', err));
    redisClient.on('connect', () => console.log('Redis bağlantısı kuruldu'));

    await redisClient.connect();
  } catch (err) {
    console.error(`Redis bağlantı hatası: ${err.message}`);
  }
};

const getRedisClient = () => redisClient;

const connectElasticsearch = async () => {
  try {
    const esUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
    elasticsearchClient = new Client({
      node: esUrl,
      requestTimeout: 10000,
    });

    try {
      const health = await elasticsearchClient.cluster.health();
      console.log(`Elasticsearch bağlantısı başarılı: ${health.cluster_name}`);
    } catch (healthErr) {
      console.warn('Elasticsearch health check başarısız, devam ediliyor...');
    }
    
    await createProductIndex();
  } catch (err) {
    console.error(`Elasticsearch bağlantı hatası: ${err.message}`);
    console.warn('Uygulama Elasticsearch olmadan devam edecek');
  }
};

const createProductIndex = async () => {
  try {
    const indexExists = await elasticsearchClient.indices.exists({
      index: 'products',
    });

    if (!indexExists) {
      await elasticsearchClient.indices.create({
        index: 'products',
        mappings: {
          properties: {
            name: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: {
                  type: 'keyword',
                },
              },
            },
            description: {
              type: 'text',
              analyzer: 'standard',
            },
            category: {
              type: 'keyword',
            },
            price: {
              type: 'float',
            },
            imageUrl: {
              type: 'keyword',
            },
            createdAt: {
              type: 'date',
            },
            updatedAt: {
              type: 'date',
            },
          },
        },
      });
      console.log('Elasticsearch products index oluşturuldu');
    }
  } catch (err) {
    console.error('Elasticsearch index oluşturma hatası:', err.message);
  }
};

const getElasticsearchClient = () => elasticsearchClient;

module.exports = {
  connectDB,
  connectRedis,
  connectElasticsearch,
  getRedisClient,
  getElasticsearchClient,
};

