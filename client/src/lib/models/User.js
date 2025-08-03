import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'credentials';
    }
  },
  provider: {
    type: String,
    enum: ['google', 'credentials'],
    default: 'credentials'
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate model compilation
export default mongoose.models.User || mongoose.model('User', userSchema); 