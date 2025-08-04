import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../lib/db';
import User from '../../../lib/models/User';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Connect to database
    await connectDB();
    console.log('Database connected successfully');

    // Check if test user exists
    const testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      console.log('Creating test user...');
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('test123', saltRounds);

      // Create test user
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        provider: 'credentials'
      });

      await user.save();
      console.log('Test user created successfully');
      
      return NextResponse.json({
        message: 'Test user created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      console.log('Test user already exists');
      return NextResponse.json({
        message: 'Test user already exists',
        user: {
          id: testUser._id,
          name: testUser.name,
          email: testUser.email
        }
      });
    }

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { message: 'Database test failed', error: error.message },
      { status: 500 }
    );
  }
} 