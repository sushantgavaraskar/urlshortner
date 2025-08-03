const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customAlias: {
    type: String,
    trim: true,
    sparse: true
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  previewImage: {
    type: String,
    trim: true
  },
  domain: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  clicks: {
    type: Number,
    default: 0
  },
  uniqueClicks: {
    type: Number,
    default: 0
  },
  lastClicked: {
    type: Date,
    default: null
  },
  clickHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ip: String,
    userAgent: String,
    referrer: String,
    country: String,
    city: String,
    device: String,
    browser: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
urlSchema.index({ userId: 1 });
urlSchema.index({ expiresAt: 1 });
urlSchema.index({ createdAt: -1 });
urlSchema.index({ clicks: -1 });

// Virtual for full short URL
urlSchema.virtual('shortUrl').get(function() {
  return `${process.env.BASE_URL || 'http://localhost:5000'}/r/${this.shortCode}`;
});

// Ensure virtual fields are serialized
urlSchema.set('toJSON', { virtuals: true });
urlSchema.set('toObject', { virtuals: true });

// Pre-save middleware to extract domain
urlSchema.pre('save', function(next) {
  if (this.originalUrl && !this.domain) {
    try {
      const url = new URL(this.originalUrl);
      this.domain = url.hostname;
    } catch (error) {
      // Invalid URL, skip domain extraction
    }
  }
  next();
});

module.exports = mongoose.model('Url', urlSchema); 