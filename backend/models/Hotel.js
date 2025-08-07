const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true,
    maxlength: [100, 'Hotel name cannot exceed 100 characters']
  },
  description: {
    type: String,
    // required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: {
      type: String,
      // required: [true, 'Address is required']
    },
    city: {
      type: String,
      // required: [true, 'City is required']
    },
    district: {
      type: String,
      // required: [true, 'District is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: {
      type: String,
      // required: [true, 'Phone number is required']
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: String
  },
  amenities: [{
    type: String,
    enum: [
      'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking',
      'AC', 'Room Service', 'Laundry', 'Business Center', 'Pet Friendly',
      'Airport Shuttle', 'Beach Access', 'Garden', 'Terrace'
    ]
  }],
  rooms: [{
    type: {
      type: String,
      required: true,
      enum: ['Single', 'Double', 'Triple', 'Suite', 'Family', 'Deluxe']
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be at least 1']
    },
    available: {
      type: Number,
      required: true,
      min: [0, 'Available rooms cannot be negative']
    },
    features: [String]
  }],
  images: [{
    url: String,
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  starRating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 3
  },
  checkInTime: {
    type: String,
    default: '14:00'
  },
  checkOutTime: {
    type: String,
    default: '11:00'
  },
  policies: {
    cancellation: String,
    children: String,
    pets: String,
    smoking: String
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'suspended'],
    default: 'pending'
  },
  isSetupComplete: {
    type: Boolean,
    default: false
  },
  completionProgress: {
    basicInfo: { type: Boolean, default: false },
    location: { type: Boolean, default: false },
    contact: { type: Boolean, default: false },
    rooms: { type: Boolean, default: false },
    amenities: { type: Boolean, default: false },
    policies: { type: Boolean, default: false }
  },
  adminCreatedFields: {
    name: { type: Boolean, default: true },
    owner: { type: Boolean, default: true }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for main image
hotelSchema.virtual('mainImage').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg ? mainImg.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Virtual for price range
hotelSchema.virtual('priceRange').get(function() {
  if (this.rooms.length === 0) return { min: 0, max: 0 };
  const prices = this.rooms.map(room => room.pricePerNight);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
});

// Virtual for completion percentage
hotelSchema.virtual('completionPercentage').get(function() {
  const sections = Object.values(this.completionProgress);
  const completed = sections.filter(Boolean).length;
  return Math.round((completed / sections.length) * 100);
});

// Method to check if hotel setup is complete
hotelSchema.methods.checkCompletionStatus = function() {
  const required = {
    basicInfo: this.description && this.description.length > 0,
    location: this.location.address && this.location.city && this.location.district,
    contact: this.contact.phone,
    rooms: this.rooms && this.rooms.length > 0,
    amenities: true, // Optional
    policies: this.checkInTime && this.checkOutTime
  };

  // Update completion progress
  this.completionProgress = required;
  
  // Check if all required sections are complete
  const isComplete = required.basicInfo && required.location &&
                    required.contact && required.rooms && required.policies;
  
  this.isSetupComplete = isComplete;
  
  return isComplete;
};

// Method to activate hotel after completion
hotelSchema.methods.activateHotel = function() {
  if (this.checkCompletionStatus()) {
    this.status = 'active';
    return this.save();
  }
  throw new Error('Hotel setup is not complete');
};

// Index for better search performance
hotelSchema.index({ name: 'text', description: 'text' });
hotelSchema.index({ 'location.city': 1 });
hotelSchema.index({ 'location.district': 1 });
hotelSchema.index({ starRating: 1 });
hotelSchema.index({ 'rating.average': -1 });
hotelSchema.index({ owner: 1 });
hotelSchema.index({ status: 1 });
hotelSchema.index({ isActive: 1, isVerified: 1 });
hotelSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);
