require('dotenv').config();
const { connectDB, disconnectDB } = require('./config/db');
const { seedDatabase } = require('./utils/seedData');

async function runSeed() {
  try {
    const { isInMemory } = await connectDB();
    const result = await seedDatabase({ force: true });
    console.log(
      `Seeded ShineHome database (${isInMemory ? 'in-memory fallback' : 'MongoDB'}): ${result.designs} designs, ${result.products} products.`
    );
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

runSeed();
