import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || process.env.LOCAL_MONGO_URI || 'mongodb://localhost:27017/prescrip';

// Path to frontend assets file
const ASSETS_FILE = join(__dirname, '../../frontend/src/assets/assets.js');

// Parse doctor object from string
function parseDoctorObject(str) {
  const doctor = {};
  
  // Extract _id
  const idMatch = str.match(/_id:\s*['"]([^'"]+)['"]/);
  if (idMatch) doctor._id = idMatch[1];
  
  // Extract name
  const nameMatch = str.match(/name:\s*['"]([^'"]+)['"]/);
  if (nameMatch) doctor.name = nameMatch[1];
  
  // Extract speciality
  const specialityMatch = str.match(/speciality:\s*['"]([^'"]+)['"]/);
  if (specialityMatch) doctor.speciality = specialityMatch[1];
  
  // Extract degree
  const degreeMatch = str.match(/degree:\s*['"]([^'"]+)['"]/);
  if (degreeMatch) doctor.degree = degreeMatch[1];
  
  // Extract experience
  const expMatch = str.match(/experience:\s*['"]([^'"]+)['"]/);
  if (expMatch) doctor.experience = expMatch[1];
  
  // Extract about
  const aboutMatch = str.match(/about:\s*['"]([^'"]*)['"]/);
  if (aboutMatch) doctor.about = aboutMatch[1];
  
  // Extract fees
  const feesMatch = str.match(/fees:\s*(\d+)/);
  if (feesMatch) doctor.fees = parseInt(feesMatch[1]);
  
  // Extract address line1
  const addr1Match = str.match(/line1:\s*['"]([^'"]+)['"]/);
  if (addr1Match) {
    doctor.address = { line1: addr1Match[1] };
  }
  
  // Extract address line2
  const addr2Match = str.match(/line2:\s*['"]([^'"]*)['"]/);
  if (addr2Match && doctor.address) {
    doctor.address.line2 = addr2Match[1];
  }
  
  // Extract coordinates
  const coordMatch = str.match(/coordinates:\s*\[([^\]]+)\]/);
  if (coordMatch) {
    const coords = coordMatch[1].split(',').map(c => parseFloat(c.trim()));
    doctor.location = { coordinates: coords };
  }
  
  return doctor;
}

async function importDoctors() {
  let client = null;
  
  try {
    console.log('🚀 Importing Doctors from Frontend Assets\n');
    
    // Read the assets file
    console.log('📖 Reading assets file...');
    const assetsContent = readFileSync(ASSETS_FILE, 'utf-8');
    
    // Find the doctors array
    const doctorsStart = assetsContent.indexOf('export const doctors = [');
    if (doctorsStart === -1) {
      throw new Error('Could not find "export const doctors = [" in assets.js');
    }
    
    // Extract the array content
    let arrayStart = doctorsStart + 'export const doctors = ['.length;
    let bracketCount = 0;
    let inString = false;
    let stringChar = null;
    let arrayEnd = arrayStart;
    
    for (let i = arrayStart; i < assetsContent.length; i++) {
      const char = assetsContent[i];
      const prevChar = i > 0 ? assetsContent[i - 1] : '';
      
      // Handle strings
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = null;
        }
        continue;
      }
      
      if (!inString) {
        if (char === '[') bracketCount++;
        if (char === ']') {
          if (bracketCount === 0) {
            arrayEnd = i;
            break;
          }
          bracketCount--;
        }
      }
    }
    
    const arrayContent = assetsContent.substring(arrayStart, arrayEnd);
    
    // Split into individual doctor objects
    const doctors = [];
    let currentObj = '';
    let objBracketCount = 0;
    inString = false;
    stringChar = null;
    
    for (let i = 0; i < arrayContent.length; i++) {
      const char = arrayContent[i];
      const prevChar = i > 0 ? arrayContent[i - 1] : '';
      
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = null;
        }
      }
      
      if (!inString) {
        if (char === '{') {
          if (objBracketCount === 0) {
            currentObj = '';
          }
          objBracketCount++;
        }
        
        if (objBracketCount > 0) {
          currentObj += char;
        }
        
        if (char === '}') {
          objBracketCount--;
          if (objBracketCount === 0 && currentObj.trim()) {
            const doctor = parseDoctorObject(currentObj);
            if (doctor._id && doctor.name) {
              doctors.push(doctor);
            }
            currentObj = '';
          }
        }
      } else if (objBracketCount > 0) {
        currentObj += char;
      }
    }
    
    console.log(`   ✅ Found ${doctors.length} doctors in assets file`);
    
    if (doctors.length === 0) {
      throw new Error('No doctors found in assets file');
    }
    
    // Connect to MongoDB
    console.log('\n🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('   ✅ Connected to MongoDB');
    
    const db = client.db('prescrip');
    const collection = db.collection('doctors');
    
    // Clear existing doctors
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`\n🗑️  Clearing ${existingCount} existing doctors...`);
      await collection.deleteMany({});
    }
    
    // Transform doctors to match database schema
    const doctorsToInsert = doctors.map(doctor => ({
      _id: doctor._id,
      name: doctor.name,
      speciality: doctor.speciality || '',
      degree: doctor.degree || '',
      experience: doctor.experience || '',
      about: doctor.about || '',
      fees: doctor.fees || 0,
      image: '',
      location: {
        type: 'Point',
        coordinates: doctor.location?.coordinates || [0, 0]
      },
      address: {
        line1: doctor.address?.line1 || '',
        line2: doctor.address?.line2 || '',
        upazila: '',
        district: '',
        division: ''
      },
      contact: {
        phone: [],
        email: ''
      },
      verified: false,
      active: true,
      createdAt: new Date(),
      lastUpdated: new Date()
    }));
    
    // Insert doctors
    console.log(`\n📥 Inserting ${doctorsToInsert.length} doctors...`);
    
    const batchSize = 10;
    let inserted = 0;
    
    for (let i = 0; i < doctorsToInsert.length; i += batchSize) {
      const batch = doctorsToInsert.slice(i, i + batchSize);
      await collection.insertMany(batch);
      inserted += batch.length;
      console.log(`   ✅ Inserted ${inserted}/${doctorsToInsert.length} doctors...`);
    }
    
    // Verify
    const finalCount = await collection.countDocuments();
    console.log(`\n✅ Successfully imported ${finalCount} doctors!`);
    
    console.log('\n📊 Summary:');
    console.log(`   Total doctors imported: ${finalCount}`);
    
    // Show sample
    const sample = await collection.find({}).limit(5).toArray();
    console.log('\n📋 Sample doctors:');
    sample.forEach(doc => {
      console.log(`   - ${doc.name} (${doc.speciality}) - ${doc.fees} TK`);
    });
    
  } catch (error) {
    console.error('\n❌ Error importing doctors:', error.message);
    console.error(error.stack);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MongoDB is running');
    console.error('   2. Check that frontend/src/assets/assets.js exists');
    console.error('   3. Verify the doctors array format in assets.js');
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

// Run import
importDoctors()
  .then(() => {
    console.log('\n✨ Done!');
    console.log('\n💡 Next step: Run migration to Atlas:');
    console.log('   npm run migrate-to-atlas');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
