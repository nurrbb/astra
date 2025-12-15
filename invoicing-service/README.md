# Invoicing Service

Invoicing microservice for Astra project.

## Features

- Listens to `payment_completed` Kafka topic
- Automatically creates invoices when payments are completed
- MongoDB integration for invoice storage
- REST API for invoice queries

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- `PORT`: Service port (default: 5002)
- `MONGODB_URI`: MongoDB connection string
- `KAFKA_BROKERS`: Kafka broker addresses (comma-separated)

4. Start the service:
```bash
npm start
# or for development
npm run dev
```

## API Endpoints

- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `GET /api/invoices/user/:userId` - Get invoices by user ID

## Kafka Topics

- `payment_completed` - Consumes payment completion events and creates invoices

