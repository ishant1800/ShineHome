require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB, isMemoryFallback } = require('./config/db');
const { seedDatabase } = require('./utils/seedData');

const authRoutes = require('./routes/auth');
const designRoutes = require('./routes/designs');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ShineHome API',
    dbState: isMemoryFallback()
      ? 'in-memory-fallback'
      : mongoose.connection.readyState === 1
      ? 'connected'
      : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  const seeded = await seedDatabase({ force: false });
  if (!seeded.skipped) {
    console.log(`Auto-seeded initial ShineHome catalog (${seeded.designs} designs, ${seeded.products} products).`);
  }
  app.listen(PORT, () => {
    console.log(`ShineHome API server running on http://localhost:${PORT}`);
  });
}

startServer();
