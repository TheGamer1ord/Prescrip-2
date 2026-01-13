import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DoctorUser from '../src/models/DoctorUser.js';
import Doctor from '../src/models/Doctor.js';
import config from '../src/config/index.js';

dotenv.config();

const createDoctorAccount = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoURI);
    console.log('Connected to MongoDB');

    // Find or create Mr.Alim Uddin doctor
    let doctor = await Doctor.findOne({ name: 'Mr.Alim Uddin' });
    
    if (!doctor) {
      console.log('Doctor "Mr.Alim Uddin" not found. Creating doctor record...');
      // Create the doctor with data from frontend assets
      doctor = new Doctor({
        name: 'Mr.Alim Uddin',
        speciality: 'neurologist',
        degree: 'MBBS, MD (Neurology), CCD (BIRDEM)',
        experience: 'Fellowship Training in ACS & EMG and Neuromuscular Disease Neurology',
        about: '',
        fees: 50,
        location: {
          type: 'Point',
          coordinates: [91.1809, 23.4607] // [lng, lat] - Cumilla center
        },
        address: {
          line1: '17th Cross, Richmond',
          line2: 'Circle, Ring Road, London',
          upazila: '',
          district: '',
          division: ''
        },
        contact: {
          phone: [],
          email: 'alimuddin@gmail.com'
        },
        verified: true,
        active: true
      });
      await doctor.save();
      console.log(`Doctor created: ${doctor.name} (ID: ${doctor._id})`);
    } else {
      console.log(`Found doctor: ${doctor.name} (ID: ${doctor._id})`);
    }

    // Check if doctor user already exists
    let doctorUser = await DoctorUser.findOne({ email: 'alimuddin@gmail.com' });

    if (doctorUser) {
      // Update existing doctor user
      doctorUser.name = 'Mr.Alim Uddin';
      doctorUser.profession = doctor.speciality || 'neurologist';
      doctorUser.doctorId = doctor._id;
      doctorUser.approved = true;
      doctorUser.active = true;
      await doctorUser.save();
      console.log('Doctor user updated successfully');
    } else {
      // Create new doctor user
      doctorUser = new DoctorUser({
        name: 'Mr.Alim Uddin',
        email: 'alimuddin@gmail.com',
        profession: doctor.speciality || 'neurologist',
        password: '12345678',
        doctorId: doctor._id,
        approved: true,
        active: true
      });
      await doctorUser.save();
      console.log('Doctor user created successfully');
    }

    // Update doctor's contact email if not set
    if (!doctor.contact || !doctor.contact.email) {
      doctor.contact = doctor.contact || {};
      doctor.contact.email = 'alimuddin@gmail.com';
      await doctor.save();
      console.log('Doctor contact email updated');
    }

    console.log('\nDoctor Account Details:');
    console.log('Email: alimuddin@gmail.com');
    console.log('Password: 12345678');
    console.log('Status: Approved');
    console.log(`Linked to Doctor: ${doctor.name} (${doctor._id})`);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error creating doctor account:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createDoctorAccount();

