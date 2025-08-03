import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../../lib/db';
import User from '../../../../lib/models/User';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      provider: 'credentials'
    });

    await user.save();

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      provider: user.provider,
      createdAt: user.createdAt
    };

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userResponse
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 