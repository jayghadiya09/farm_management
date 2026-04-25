import 'dotenv/config';
import { db, pool } from './db';
import { users, crops, equipment, orders, inventory, irrigation, soilHealth } from '@shared/schema';
import { sql } from 'drizzle-orm';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create sample user
    console.log('Creating sample user...');
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    
    await db.insert(users).values({
      id: userId,
      email: 'demo@farm.com',
      password: 'hashed_password_here',
      name: 'Demo Farmer',
      farmName: 'Green Valley Farm',
      farmLocation: 'California',
      contact: '+1-555-0123',
      totalArea: '50 acres'
    }).onConflictDoNothing();
    
    console.log('✓ User created');

    // Create sample crops
    console.log('Creating sample crops...');
    await db.insert(crops).values([
      {
        name: 'Wheat',
        variety: 'Winter Wheat',
        area: '10 acres',
        plantingDate: new Date('2024-10-01'),
        harvestDate: new Date('2025-06-01'),
        status: 'Active',
        healthStatus: 'Good',
        notes: 'Premium quality wheat',
        userId
      },
      {
        name: 'Corn',
        variety: 'Sweet Corn',
        area: '15 acres',
        plantingDate: new Date('2024-04-01'),
        harvestDate: new Date('2024-09-01'),
        status: 'Active',
        healthStatus: 'Excellent',
        notes: 'High yield variety',
        userId
      },
      {
        name: 'Soybeans',
        variety: 'Roundup Ready',
        area: '12 acres',
        plantingDate: new Date('2024-05-01'),
        harvestDate: new Date('2024-10-15'),
        status: 'Growing',
        healthStatus: 'Good',
        notes: 'Disease resistant strain',
        userId
      }
    ]).onConflictDoNothing();
    
    console.log('✓ Crops created');

    // Create sample equipment
    console.log('Creating sample equipment...');
    await db.insert(equipment).values([
      {
        name: 'Tractor John Deere',
        type: 'Tractor',
        status: 'Operational',
        fuelLevel: '75%',
        lastMaintenance: new Date('2024-03-15'),
        nextMaintenance: new Date('2024-09-15'),
        notes: 'Primary tractor for plowing',
        userId
      },
      {
        name: 'Combine Harvester',
        type: 'Harvester',
        status: 'Operational',
        fuelLevel: '50%',
        lastMaintenance: new Date('2024-02-20'),
        nextMaintenance: new Date('2024-08-20'),
        notes: 'Ready for harvest season',
        userId
      },
      {
        name: 'Irrigation Pump',
        type: 'Pump',
        status: 'Operational',
        fuelLevel: 'N/A',
        lastMaintenance: new Date('2024-03-10'),
        nextMaintenance: new Date('2024-12-10'),
        notes: 'Electric powered, high capacity',
        userId
      }
    ]).onConflictDoNothing();
    
    console.log('✓ Equipment created');

    // Create sample inventory
    console.log('Creating sample inventory...');
    await db.insert(inventory).values([
      {
        name: 'NPK Fertilizer',
        quantity: '500 kg',
        status: 'In Stock',
        userId
      },
      {
        name: 'Pesticide',
        quantity: '50 liters',
        status: 'In Stock',
        userId
      },
      {
        name: 'Seeds - Wheat',
        quantity: '100 kg',
        status: 'Low Stock',
        userId
      },
      {
        name: 'Herbicide',
        quantity: '30 liters',
        status: 'In Stock',
        userId
      }
    ]).onConflictDoNothing();
    
    console.log('✓ Inventory created');

    // Create sample irrigation schedules
    console.log('Creating sample irrigation schedules...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await db.insert(irrigation).values([
      {
        fieldName: 'North Field',
        scheduledTime: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000),
        duration: '2 hours',
        waterUsage: '500 gallons',
        status: 'Scheduled',
        notes: 'Routine irrigation',
        userId
      },
      {
        fieldName: 'South Field',
        scheduledTime: new Date(tomorrow.getTime() + 12 * 60 * 60 * 1000),
        duration: '3 hours',
        waterUsage: '750 gallons',
        status: 'Scheduled',
        notes: 'Heavy irrigation',
        userId
      }
    ]).onConflictDoNothing();
    
    console.log('✓ Irrigation schedules created');

    // Create sample soil health data
    console.log('Creating sample soil health data...');
    await db.insert(soilHealth).values([
      {
        moisture: '65',
        phLevel: '6.8',
        nitrogen: '45',
        phosphorus: '35',
        potassium: '40',
        notes: 'Optimal soil conditions',
        userId
      },
      {
        moisture: '58',
        phLevel: '7.0',
        nitrogen: '50',
        phosphorus: '38',
        potassium: '42',
        notes: 'Slightly alkaline',
        userId
      }
    ]).onConflictDoNothing();
    
    console.log('✓ Soil health data created');

    // Create sample orders
    console.log('Creating sample orders...');
    await db.insert(orders).values([
      {
        orderId: `ORD-${Date.now()}-001`,
        orderDetails: 'NPK Fertilizer - 500 kg',
        userId
      },
      {
        orderId: `ORD-${Date.now()}-002`,
        orderDetails: 'Seeds - Wheat variety, 100 kg',
        userId
      }
    ]).onConflictDoNothing();
    
    console.log('✓ Orders created');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Demo Credentials:');
    console.log('   Email: demo@farm.com');
    console.log('   Password: (Set in database - for demo purposes)');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed().catch(console.error);
