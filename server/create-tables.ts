import 'dotenv/config';
import { pool } from './db';

async function createTables() {
  const client = await pool.connect();
  try {
    console.log('📦 Creating database tables...');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT,
        farm_name TEXT,
        farm_location TEXT,
        contact TEXT,
        total_area TEXT,
        profile_photo TEXT
      );
    `);
    console.log('✓ Users table created');

    // Create crops table
    await client.query(`
      CREATE TABLE IF NOT EXISTS crops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        variety VARCHAR(255),
        area VARCHAR(100),
        planting_date TIMESTAMP,
        harvest_date TIMESTAMP,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        health_status VARCHAR(50) DEFAULT 'Good',
        notes TEXT,
        user_id VARCHAR NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✓ Crops table created');

    // Create equipment table
    await client.query(`
      CREATE TABLE IF NOT EXISTS equipment (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Operational',
        fuel_level VARCHAR(50),
        last_maintenance TIMESTAMP,
        next_maintenance TIMESTAMP,
        notes TEXT,
        user_id VARCHAR NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✓ Equipment table created');

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL UNIQUE,
        order_details TEXT NOT NULL,
        order_date TIMESTAMP NOT NULL DEFAULT NOW(),
        user_id VARCHAR NOT NULL REFERENCES users(id)
      );
    `);
    console.log('✓ Orders table created');

    // Create inventory table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        quantity VARCHAR(100),
        status VARCHAR(50) NOT NULL,
        user_id VARCHAR NOT NULL REFERENCES users(id)
      );
    `);
    console.log('✓ Inventory table created');

    // Create irrigation table
    await client.query(`
      CREATE TABLE IF NOT EXISTS irrigation (
        id SERIAL PRIMARY KEY,
        field_name VARCHAR(255) NOT NULL,
        scheduled_time TIMESTAMP NOT NULL,
        duration VARCHAR(100) NOT NULL,
        water_usage VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Scheduled',
        notes TEXT,
        user_id VARCHAR NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✓ Irrigation table created');

    // Create soil_health table
    await client.query(`
      CREATE TABLE IF NOT EXISTS soil_health (
        id SERIAL PRIMARY KEY,
        moisture VARCHAR(10) NOT NULL,
        ph_level VARCHAR(10) NOT NULL,
        nitrogen VARCHAR(10) NOT NULL,
        phosphorus VARCHAR(10) NOT NULL,
        potassium VARCHAR(10) NOT NULL,
        notes TEXT,
        user_id VARCHAR NOT NULL REFERENCES users(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✓ Soil Health table created');

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_crops_user_id ON crops(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_equipment_user_id ON equipment(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_irrigation_user_id ON irrigation(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_soil_health_user_id ON soil_health(user_id);`);
    console.log('✓ Indexes created');

    console.log('\n✅ All tables created successfully!\n');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

createTables().catch(err => {
  console.error('Failed to create tables:', err);
  process.exit(1);
});
