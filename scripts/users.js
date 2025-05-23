// Database seeding script
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ObjectId } = mongoose.Types;

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

// Define Route Schema
const RouteSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: [true, 'Please provide a route path'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a route name'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
  },
  { timestamps: true }
);

// Create Route model
const Route = mongoose.models.Route || mongoose.model('Route', RouteSchema);

// Define UserRight Schema
const UserRightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: [true, 'Please provide a route ID'],
    },
    canAdd: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    canSave: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
    canPrint: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a compound index to ensure a user can only have one permission set per route
UserRightSchema.index({ userId: 1, routeId: 1 }, { unique: true });

// Create UserRight model
const UserRight = mongoose.models.UserRight || mongoose.model('UserRight', UserRightSchema);

// Define MstCompany Schema
const MstCompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Please provide a company name'],
      maxlength: [100, 'Company name cannot be more than 100 characters'],
    },
    companyAddress: {
      type: String,
      required: [true, 'Please provide a company address'],
    },
    contactPerson: {
      type: String,
      required: [true, 'Please provide a contact person'],
    },
    contactNo: {
      type: String,
      required: [true, 'Please provide a contact number'],
    },
    tiin: {
      type: String,
    },
    bookNumber: {
      type: String,
    },
    accreditationNumber: {
      type: String,
    },
    serialNumber: {
      type: String,
    },
    permitNumber: {
      type: String,
    },
    accountant: {
      type: String,
    },
    financeManager: {
      type: String,
    },
    operationsManager: {
      type: String,
    },
    managingDirector: {
      type: String,
    },
    defaultApproveBy: {
      type: String,
    },
    imagePath: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create MstCompany model
const MstCompany = mongoose.models.MstCompany || mongoose.model('MstCompany', MstCompanySchema);

// Define MstWarehouse Schema
const MstWarehouseSchema = new mongoose.Schema(
  {
    warehouseCode: {
      type: String,
      required: [true, 'Please provide a warehouse code'],
      unique: true,
    },
    warehouseName: {
      type: String,
      required: [true, 'Please provide a warehouse name'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MstCompany',
      required: [true, 'Please provide a company ID'],
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    contact: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create MstWarehouse model
const MstWarehouse = mongoose.models.MstWarehouse || mongoose.model('MstWarehouse', MstWarehouseSchema);

// Define seed data
// Routes for the application
const seedRoutes = [
  {
    path: '/pages/dashboard',
    name: 'Dashboard',
    description: 'Main dashboard view',
  },
  {
    path: '/pages/inventory',
    name: 'Inventory',
    description: 'Inventory management',
  },
  {
    path: '/pages/users',
    name: 'Users',
    description: 'User management',
  },
  {
    path: '/pages/reports',
    name: 'Reports',
    description: 'Reports and analytics',
  },
  {
    path: '/pages/settings',
    name: 'Settings',
    description: 'System settings',
  },
];

const seedUsers = [
  {
    name: 'Erwin Wilson Ceniza',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Neil Adrianne',
    email: 'manager@example.com',
    password: 'password123',
    role: 'manager',
  },
  {
    name: 'Lourd Wilson',
    email: 'worker@example.com',
    password: 'password123',
    role: 'worker',
  },
];

// Seed data for companies
const seedCompanies = [
  {
    companyName: 'Global Logistics Inc.',
    companyAddress: '123 Main Street, Business District, Metro City',
    contactPerson: 'John Smith',
    contactNo: '+1-555-123-4567',
    tiin: '123-456-789-000',
    bookNumber: 'BK-2023-001',
    accreditationNumber: 'ACC-2023-0123',
    serialNumber: 'SER-2023-456',
    permitNumber: 'PER-2023-789',
    accountant: 'Jane Doe',
    financeManager: 'Robert Johnson',
    operationsManager: 'Sarah Williams',
    managingDirector: 'Michael Brown',
    defaultApproveBy: 'Michael Brown',
    imagePath: '/images/companies/global-logistics.png',
  },
  {
    companyName: 'Fast Track Shipping Co.',
    companyAddress: '456 Commerce Avenue, Industrial Park, Harbor City',
    contactPerson: 'Emily Davis',
    contactNo: '+1-555-987-6543',
    tiin: '987-654-321-000',
    bookNumber: 'BK-2023-002',
    accreditationNumber: 'ACC-2023-0456',
    serialNumber: 'SER-2023-789',
    permitNumber: 'PER-2023-012',
    accountant: 'Thomas Wilson',
    financeManager: 'Lisa Anderson',
    operationsManager: 'David Martinez',
    managingDirector: 'Jennifer Taylor',
    defaultApproveBy: 'Jennifer Taylor',
    imagePath: '/images/companies/fast-track.png',
  },
];

// Seed data for warehouses (will be linked to companies during seeding)
const seedWarehouses = [
  {
    warehouseCode: 'WH-GL-001',
    warehouseName: 'Global Logistics Main Warehouse',
    // companyId will be set during seeding
    address: '123 Storage Lane, Warehouse District, Metro City',
    contact: 'Mark Wilson',
    contactNumber: '+1-555-111-2222',
  },
  {
    warehouseCode: 'WH-GL-002',
    warehouseName: 'Global Logistics Satellite Facility',
    // companyId will be set during seeding
    address: '789 Distribution Road, Industrial Zone, Metro City',
    contact: 'Laura Johnson',
    contactNumber: '+1-555-333-4444',
  },
  {
    warehouseCode: 'WH-FT-001',
    warehouseName: 'Fast Track Central Hub',
    // companyId will be set during seeding
    address: '456 Shipping Boulevard, Port District, Harbor City',
    contact: 'Chris Thompson',
    contactNumber: '+1-555-555-6666',
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
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Route.deleteMany({});
    await UserRight.deleteMany({});
    await MstCompany.deleteMany({});
    await MstWarehouse.deleteMany({});
    
    // Create new users
    console.log('Creating new users...');
    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`Created user: ${userData.email} (${userData.role})`);
    }
    
    // Create new routes
    console.log('\nCreating routes...');
    const createdRoutes = [];
    for (const routeData of seedRoutes) {
      const route = await Route.create(routeData);
      createdRoutes.push(route);
      console.log(`Created route: ${routeData.name} (${routeData.path})`);
    }
    
    // Create user rights based on roles
    console.log('\nCreating user rights...');
    const userRights = [];
    
    // Find users by role
    const adminUser = createdUsers.find(user => user.role === 'admin');
    const managerUser = createdUsers.find(user => user.role === 'manager');
    const workerUser = createdUsers.find(user => user.role === 'worker');
    
    // Admin gets full access to all routes
    for (const route of createdRoutes) {
      userRights.push({
        userId: adminUser._id,
        routeId: route._id,
        canAdd: true,
        canEdit: true,
        canSave: true,
        canDelete: true,
        canPrint: true,
      });
    }
    
    // Manager gets full access to most routes except settings (no delete)
    for (const route of createdRoutes) {
      if (route.path === '/pages/settings') {
        userRights.push({
          userId: managerUser._id,
          routeId: route._id,
          canAdd: false,
          canEdit: true,
          canSave: true,
          canDelete: false,
          canPrint: true,
        });
      } else {
        userRights.push({
          userId: managerUser._id,
          routeId: route._id,
          canAdd: true,
          canEdit: true,
          canSave: true,
          canDelete: route.path !== '/pages/users', // No deleting users
          canPrint: true,
        });
      }
    }
    
    // Worker gets limited access
    for (const route of createdRoutes) {
      if (route.path === '/pages/dashboard' || route.path === '/pages/inventory') {
        userRights.push({
          userId: workerUser._id,
          routeId: route._id,
          canAdd: route.path === '/pages/inventory',
          canEdit: route.path === '/pages/inventory',
          canSave: route.path === '/pages/inventory',
          canDelete: false,
          canPrint: true,
        });
      }
    }
    
    // Save all user rights
    for (const rightData of userRights) {
      await UserRight.create(rightData);
    }
    console.log(`Created ${userRights.length} user rights records`);
    
    // Create companies
    console.log('\nCreating companies...');
    const createdCompanies = [];
    for (const companyData of seedCompanies) {
      const company = await MstCompany.create(companyData);
      createdCompanies.push(company);
      console.log(`Created company: ${companyData.companyName}`);
    }
    
    // Create warehouses and link them to companies
    console.log('\nCreating warehouses...');
    const globalLogistics = createdCompanies.find(company => company.companyName === 'Global Logistics Inc.');
    const fastTrack = createdCompanies.find(company => company.companyName === 'Fast Track Shipping Co.');
    
    // Assign company IDs to warehouses
    const warehousesWithCompanies = [
      {
        ...seedWarehouses[0],
        companyId: globalLogistics._id
      },
      {
        ...seedWarehouses[1],
        companyId: globalLogistics._id
      },
      {
        ...seedWarehouses[2],
        companyId: fastTrack._id
      }
    ];
    
    for (const warehouseData of warehousesWithCompanies) {
      const warehouse = await MstWarehouse.create(warehouseData);
      console.log(`Created warehouse: ${warehouseData.warehouseName} (${warehouseData.warehouseCode})`);
    }
    
    console.log('\nDatabase seeding completed successfully!');
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

//node scripts/seed.js