import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Local MongoDB connection
const LOCAL_URI = process.env.LOCAL_MONGO_URI || 'mongodb://localhost:27017/prescrip';

// Atlas MongoDB connection (you'll need to set this)
let ATLAS_URI = process.env.MONGO_URI;

// Fix common .env file issues
if (ATLAS_URI) {
  // Remove duplicate "MONGO_URI=" if present
  if (ATLAS_URI.startsWith('MONGO_URI=')) {
    ATLAS_URI = ATLAS_URI.replace(/^MONGO_URI=/, '');
    console.warn('⚠️  Fixed: Removed duplicate MONGO_URI= from connection string');
  }
  // Trim whitespace
  ATLAS_URI = ATLAS_URI.trim();
}

if (!ATLAS_URI) {
  console.error('❌ Error: MONGO_URI not found in .env file');
  console.log('\n📝 Please add your Atlas connection string to backend/.env:');
  console.log('   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prescrip?retryWrites=true&w=majority\n');
  process.exit(1);
}

// Check if Atlas URI looks correct (should contain mongodb+srv://)
if (!ATLAS_URI.includes('mongodb+srv://') && !ATLAS_URI.includes('cluster0')) {
  console.warn('⚠️  Warning: Your MONGO_URI does not look like an Atlas connection string!');
  console.warn('   Expected format: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prescrip');
  console.warn('   Current value:', ATLAS_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
}

// Collections to migrate
const COLLECTIONS_TO_MIGRATE = [
  'users',
  'doctors',
  'doctorusers',
  'appointments',
  'healthfacilities'
];

async function migrateCollection(localClient, atlasClient, collectionName) {
  try {
    console.log(`\n📦 Migrating collection: ${collectionName}...`);
    
    // Get databases
    const localDb = localClient.db('prescrip');
    const atlasDb = atlasClient.db('prescrip');
    
    // Get collections
    const localCollection = localDb.collection(collectionName);
    const atlasCollection = atlasDb.collection(collectionName);
    
    // Check if collection exists locally
    const collections = await localDb.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
      console.log(`   ⚠️  Collection '${collectionName}' not found locally, skipping...`);
      return { success: true, skipped: true, count: 0 };
    }
    
    // Count documents
    const count = await localCollection.countDocuments();
    console.log(`   📊 Found ${count} documents`);
    
    if (count === 0) {
      console.log(`   ⚠️  Collection '${collectionName}' is empty, skipping...`);
      return { success: true, skipped: true, count: 0 };
    }
    
    // Fetch all documents from local
    const documents = await localCollection.find({}).toArray();
    console.log(`   📥 Fetched ${documents.length} documents from local database`);
    
    // Clear existing data in Atlas (optional - comment out if you want to keep existing data)
    const existingCount = await atlasCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`   🗑️  Clearing ${existingCount} existing documents in Atlas...`);
      await atlasCollection.deleteMany({});
    }
    
    // Insert documents into Atlas
    if (documents.length > 0) {
      await atlasCollection.insertMany(documents);
      console.log(`   ✅ Successfully inserted ${documents.length} documents into Atlas`);
    }
    
    return { success: true, skipped: false, count: documents.length };
  } catch (error) {
    console.error(`   ❌ Error migrating ${collectionName}:`, error.message);
    return { success: false, error: error.message, count: 0 };
  }
}

async function migrateDatabase() {
  let localClient = null;
  let atlasClient = null;
  
  try {
    console.log('🚀 Starting MongoDB Migration: Local → Atlas\n');
    console.log('📍 Local URI:', LOCAL_URI);
    console.log('☁️  Atlas URI:', ATLAS_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials
    
    // Connect to local MongoDB
    console.log('\n🔌 Connecting to local MongoDB...');
    localClient = new MongoClient(LOCAL_URI);
    await localClient.connect();
    console.log('   ✅ Connected to local MongoDB');
    
    // Connect to Atlas
    console.log('\n🔌 Connecting to MongoDB Atlas...');
    atlasClient = new MongoClient(ATLAS_URI);
    await atlasClient.connect();
    console.log('   ✅ Connected to MongoDB Atlas');
    
    // Migrate each collection
    const results = [];
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      const result = await migrateCollection(localClient, atlasClient, collectionName);
      results.push({ collection: collectionName, ...result });
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    
    let totalMigrated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    
    results.forEach(result => {
      if (result.success) {
        if (result.skipped) {
          console.log(`   ⚠️  ${result.collection}: Skipped (empty or not found)`);
          totalSkipped++;
        } else {
          console.log(`   ✅ ${result.collection}: ${result.count} documents migrated`);
          totalMigrated += result.count;
        }
      } else {
        console.log(`   ❌ ${result.collection}: Error - ${result.error}`);
        totalErrors++;
      }
    });
    
    console.log('='.repeat(60));
    console.log(`✅ Total documents migrated: ${totalMigrated}`);
    if (totalSkipped > 0) {
      console.log(`⚠️  Collections skipped: ${totalSkipped}`);
    }
    if (totalErrors > 0) {
      console.log(`❌ Collections with errors: ${totalErrors}`);
    }
    console.log('='.repeat(60));
    console.log('\n🎉 Migration completed!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure local MongoDB is running');
    console.error('   2. Check your Atlas connection string in .env');
    console.error('   3. Verify your IP is whitelisted in Atlas Network Access');
    console.error('   4. Check your Atlas username and password');
    process.exit(1);
  } finally {
    // Close connections
    if (localClient) {
      await localClient.close();
      console.log('\n🔌 Disconnected from local MongoDB');
    }
    if (atlasClient) {
      await atlasClient.close();
      console.log('🔌 Disconnected from MongoDB Atlas');
    }
  }
}

// Run migration
migrateDatabase()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

