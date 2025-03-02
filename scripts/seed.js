// Database seeding script
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Check for MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error('Please add your MongoDB URI to .env.local');
  process.exit(1);
}

// Define User Schema (simplified version of the actual model)
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'worker'],
      default: 'worker',
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create User model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Define seed data
const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'password123',
    role: 'manager',
  },
  {
    name: 'Worker User',
    email: 'worker@example.com',
    password: 'password123',
    role: 'worker',
  },
];

// Seed function
async function seedDatabase() {
  try {
    // Connect to MongoDB first and wait for the connection
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('Connected to MongoDB');
    
    // Clear existing users
    console.log('Clearing existing users...');
    await User.deleteMany({});
    
    // Create new users
    console.log('Creating new users...');
    for (const userData of seedUsers) {
      await User.create(userData);
      console.log(`Created user: ${userData.email} (${userData.role})`);
    }
    
    console.log('Database seeding completed successfully!');
    console.log('\nYou can now log in with the following credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Manager: manager@example.com / password123');
    console.log('Worker: worker@example.com / password123');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();