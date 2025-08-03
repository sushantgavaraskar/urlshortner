// MongoDB initialization script for Docker
// This script runs when the MongoDB container starts for the first time

// Switch to the smartshort database
db = db.getSiblingDB('smartshort');

// Create a user for the application
db.createUser({
  user: 'smartshort_user',
  pwd: 'smartshort_password',
  roles: [
    {
      role: 'readWrite',
      db: 'smartshort'
    }
  ]
});

// Create collections with proper indexes
db.createCollection('users');
db.createCollection('urls');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "providerId": 1 });

db.urls.createIndex({ "shortCode": 1 }, { unique: true });
db.urls.createIndex({ "userId": 1 });
db.urls.createIndex({ "expiresAt": 1 });
db.urls.createIndex({ "createdAt": -1 });
db.urls.createIndex({ "clicks": -1 });

// Insert some initial data (optional)
db.users.insertOne({
  email: 'demo@example.com',
  name: 'Demo User',
  provider: 'credentials',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('✅ MongoDB initialized successfully');
print('📊 Database: smartshort');
print('👤 User: smartshort_user');
print('🔗 Collections: users, urls'); 