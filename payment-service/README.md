# Payment Service

Payment microservice for Astra project.

## Features

- Process payment transactions
- Kafka integration for event publishing
- Publishes `payment_completed` events to Kafka

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
- `PORT`: Service port (default: 5001)
- `KAFKA_BROKERS`: Kafka broker addresses (comma-separated)

4. Start the service:
```bash
npm start
# or for development
npm run dev
```

## API Endpoints

- `POST /api/payments/process` - Process a payment

### Request Body:
```json
{
  "orderId": "ORDER123",
  "amount": 99.99,
  "userId": "USER456",
  "paymentMethod": "credit_card"
}
```

## Kafka Topics

- `payment_completed` - Published when a payment is successfully processed

