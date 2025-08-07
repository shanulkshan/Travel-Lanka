const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Transport service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'Car Rental', 'Taxi Service', 'Bus Service', 'Train Service',
      'Tuk Tuk', 'Motorbike Rental', 'Bicycle Rental', 'Boat Service',
      'Helicopter Tour', 'Airport Transfer', 'Tour Package'
    ]
  },
  serviceArea: [{
    city: String,
    district: String
  }],
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: String,
    address: String
  },
  vehicles: [{
    type: {
      type: String,
      required: true,
      enum: [
        'Sedan', 'SUV', 'Van', 'Bus', 'Luxury Car', 'Tuk Tuk',
        'Motorbike', 'Bicycle', 'Boat', 'Helicopter', 'Train'
      ]
    },
    model: String,
    year: Number,
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be at least 1']
    },
    pricePerDay: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    pricePerKm: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    pricePerHour: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    features: [{
      type: String,
      enum: [
        'AC', 'GPS', 'WiFi', 'Driver Included', 'Fuel Included',
        'Insurance', 'Child Seat', 'Wheelchair Accessible',
        'Luxury Interior', 'Sound System', 'Refrigerator'
      ]
    }],
    available: {
      type: Number,
      required: true,
      min: [0, 'Available vehicles cannot be negative']
    },
    images: [String],
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  services: [{
    name: String,
    description: String,
    price: Number,
    duration: String, // e.g., "2 hours", "Full day"
    includes: [String]
  }],
  operatingHours: {
    monday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    friday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, isClosed: { type: Boolean, default: false } }
  },
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
  policies: {
    cancellation: String,
    deposit: String,
    driverLicense: String,
    age: String,
    insurance: String
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
    contact: { type: Boolean, default: false },
    serviceArea: { type: Boolean, default: false },
    vehicles: { type: Boolean, default: false },
    policies: { type: Boolean, default: false }
  },
  adminCreatedFields: {
    name: { type: Boolean, default: true },
    owner: { type: Boolean, default: true },
    type: { type: Boolean, default: true }
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
transportSchema.virtual('mainImage').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg ? mainImg.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Virtual for price range
transportSchema.virtual('priceRange').get(function() {
  if (this.vehicles.length === 0) return { min: 0, max: 0 };
  
  const allPrices = [];
  this.vehicles.forEach(vehicle => {
    if (vehicle.pricePerDay) allPrices.push(vehicle.pricePerDay);
    if (vehicle.pricePerKm) allPrices.push(vehicle.pricePerKm * 100); // Assume 100km for comparison
    if (vehicle.pricePerHour) allPrices.push(vehicle.pricePerHour * 8); // Assume 8 hours for comparison
  });
  
  if (allPrices.length === 0) return { min: 0, max: 0 };
  
  return {
    min: Math.min(...allPrices),
    max: Math.max(...allPrices)
  };
});

// Virtual for total available vehicles
transportSchema.virtual('totalAvailable').get(function() {
  return this.vehicles.reduce((total, vehicle) => total + vehicle.available, 0);
});

// Virtual for completion percentage
transportSchema.virtual('completionPercentage').get(function() {
  const sections = Object.values(this.completionProgress);
  const completed = sections.filter(Boolean).length;
  return Math.round((completed / sections.length) * 100);
});

// Method to check if transport setup is complete
transportSchema.methods.checkCompletionStatus = function() {
  const required = {
    basicInfo: this.description && this.description.length > 0,
    contact: this.contact.phone,
    serviceArea: this.serviceArea && this.serviceArea.length > 0,
    vehicles: this.vehicles && this.vehicles.length > 0 &&
              this.vehicles.some(vehicle => vehicle.pricePerDay || vehicle.pricePerKm || vehicle.pricePerHour),
    policies: this.policies && (this.policies.cancellation || this.policies.deposit)
  };

  // Update completion progress
  this.completionProgress = required;
  
  // Check if all required sections are complete
  const isComplete = required.basicInfo && required.contact &&
                    required.serviceArea && required.vehicles && required.policies;
  
  this.isSetupComplete = isComplete;
  
  return isComplete;
};

// Method to activate transport after completion
transportSchema.methods.activateTransport = function() {
  if (this.checkCompletionStatus()) {
    this.status = 'active';
    return this.save();
  }
  throw new Error('Transport setup is not complete');
};

// Index for better search performance
transportSchema.index({ name: 'text', description: 'text' });
transportSchema.index({ type: 1 });
transportSchema.index({ 'serviceArea.city': 1 });
transportSchema.index({ 'serviceArea.district': 1 });
transportSchema.index({ 'rating.average': -1 });
transportSchema.index({ owner: 1 });
transportSchema.index({ status: 1 });
transportSchema.index({ isActive: 1, isVerified: 1 });
transportSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Transport', transportSchema);
