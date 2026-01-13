// backend/scripts/importFacilities.js
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import * as shapefile from "shapefile";
import HealthFacility from "../src/models/HealthFacility.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/prescrip";

// Map facility types to our enum values
function mapFacilityType(type) {
  const typeMap = {
    'hospital': 'hospital',
    'clinic': 'clinic',
    'doctors': 'clinic',
    'pharmacy': 'clinic',
    'community_clinic': 'community_clinic',
    'upazila_health_complex': 'upazila_health_complex',
    'union_health_center': 'union_health_center',
    'medical_centre': 'clinic',
    'health_post': 'community_clinic',
    'health_center': 'community_clinic'
  };
  
  const normalizedType = (type || '').toLowerCase().replace(/\s+/g, '_');
  return typeMap[normalizedType] || 'clinic';
}

// Extract district and division from upazila/location
function extractLocationInfo(upazila, address) {
  // Default values - in a real scenario, you might want to geocode or use a mapping
  return {
    upazila: upazila || 'Unknown',
    district: upazila || 'Unknown',
    division: 'Dhaka', // Default division
    address: address || 'Address not available'
  };
}

// ------------------ Database Connection ------------------
async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected");
}

// ------------------ Import Facilities from shapefiles ------------------
async function importFacilities() {
  const shpPath = path.join(process.cwd(), "data", "facilities.shp");
  const dbfPath = path.join(process.cwd(), "data", "facilities.dbf");

  const facilities = [];
  console.log("📍 Reading shapefile...");

  try {
    if (!fs.existsSync(shpPath) || !fs.existsSync(dbfPath)) {
      console.warn("⚠️ Shapefile not found. Skipping shapefile import.");
      return [];
    }

    const source = await shapefile.open(shpPath, dbfPath);
    let result;
    let count = 0;

    while (!(result = await source.read()).done) {
      const { geometry, properties } = result.value;
      if (!geometry || !geometry.coordinates) continue;

      // Normalize coordinates - shapefile has [longitude, latitude]
      let coords;
      if (Array.isArray(geometry.coordinates[0])) {
        coords = geometry.coordinates[0];
      } else {
        coords = geometry.coordinates;
      }

      // Ensure we have valid coordinates [lng, lat]
      if (coords.length < 2 || !coords[0] || !coords[1]) continue;

      const name = properties?.name_bn || 
                   properties?.name_en || 
                   properties?.name || 
                   `Facility ${count + 1}`;
      
      const facilityType = mapFacilityType(
        properties?.amenity || 
        properties?.healthcare || 
        properties?.type || 
        'clinic'
      );
      
      const upazila = properties?.addr_city || 
                      properties?.upazila || 
                      properties?.city || 
                      '';
      
      const address = properties?.addr_full || 
                      properties?.address || 
                      properties?.addr_street || 
                      '';
      
      const locationInfo = extractLocationInfo(upazila, address);

      facilities.push({
        name: name,
        type: facilityType,
        location: {
          type: 'Point',
          coordinates: [coords[0], coords[1]] // [longitude, latitude]
        },
        address: locationInfo.address,
        upazila: locationInfo.upazila,
        district: locationInfo.district,
        division: locationInfo.division,
        services: properties?.services ? properties.services.split(',').map(s => s.trim()) : [],
        contact: {
          phone: properties?.phone || properties?.contact || null,
          email: properties?.email || null
        },
        operatingHours: properties?.opening_hours || null,
        accessibility: {
          roadAccess: true,
          publicTransport: properties?.public_transport === 'yes' || false,
          transportOptions: [],
          accessibilityNotes: null
        },
        verified: false,
        lastUpdated: new Date()
      });
      
      count++;
    }

    console.log(`📊 Processed ${facilities.length} facilities from shapefile`);

    if (facilities.length > 0) {
      // Clear existing facilities (optional - comment out if you want to keep existing data)
      // await HealthFacility.deleteMany({});
      
      // Insert facilities (use insertMany with ordered: false to skip duplicates)
      try {
        const inserted = await HealthFacility.insertMany(facilities, { ordered: false });
        console.log(`✅ Successfully imported ${inserted.length} facilities`);
        return inserted.length;
      } catch (error) {
        // Handle duplicate key errors
        if (error.code === 11000) {
          console.log(`⚠️ Some facilities already exist. Inserted new facilities.`);
          // Count how many were actually inserted
          let insertedCount = 0;
          for (const facility of facilities) {
            try {
              await HealthFacility.create(facility);
              insertedCount++;
            } catch (err) {
              // Skip duplicates
            }
          }
          console.log(`✅ Imported ${insertedCount} new facilities`);
          return insertedCount;
        }
        throw error;
      }
    } else {
      console.log("⚠️ No facilities found in shapefile");
      return 0;
    }
  } catch (error) {
    console.error("❌ Error reading shapefile:", error.message);
    throw error;
  }
}

// ------------------ Main Runner ------------------
async function main() {
  try {
    await connectDB();
    const count = await importFacilities();
    console.log(`🎉 Import completed! ${count} facilities imported.`);
    
    // Show some stats
    const totalFacilities = await HealthFacility.countDocuments();
    console.log(`📈 Total facilities in database: ${totalFacilities}`);
    
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Import error:", err);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

main();

