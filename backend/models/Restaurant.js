const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
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
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    district: {
      type: String,
      required: [true, 'District is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
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
    website: String
  },
  cuisine: [{
    type: String,
    enum: [
      'Sri Lankan', 'Indian', 'Chinese', 'Italian', 'Thai', 'Japanese',
      'Continental', 'Seafood', 'Vegetarian', 'Vegan', 'Fast Food',
      'Bakery', 'Cafe', 'Bar & Grill', 'Fine Dining', 'Buffet'
    ]
  }],
  features: [{
    type: String,
    enum: [
      'WiFi', 'Parking', 'AC', 'Outdoor Seating', 'Private Dining',
      'Live Music', 'Delivery', 'Takeaway', 'Bar', 'Kids Menu',
      'Wheelchair Accessible', 'Pet Friendly', 'Beach View', 'Garden View'
    ]
  }],
  priceRange: {
    type: String,
    enum: ['Budget', 'Mid-range', 'Fine Dining', 'Luxury'],
    default: 'Budget'
  },
  capacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1'],
    default: 1
  },
  operatingHours: {
    monday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    friday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, isClosed: { type: Boolean, default: false } }
  },
  menu: [{
    category: {
      type: String,
      required: true
    },
    items: [{
      name: {
        type: String,
        required: true
      },
      description: String,
      price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
      },
      isVegetarian: {
        type: Boolean,
        default: false
      },
      isVegan: {
        type: Boolean,
        default: false
      },
      allergens: [String],
      image: String
    }]
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
    menu: { type: Boolean, default: false },
    hours: { type: Boolean, default: false },
    capacity: { type: Boolean, default: false }
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
restaurantSchema.virtual('mainImage').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg ? mainImg.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Virtual for current operating status
restaurantSchema.virtual('isCurrentlyOpen').get(function() {
  const now = new Date();
  const currentDay = now.toLocaleLowerCase('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  const todayHours = this.operatingHours[currentDay];
  if (!todayHours || todayHours.isClosed) return false;
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
});

// Virtual for completion percentage
restaurantSchema.virtual('completionPercentage').get(function() {
  const sections = Object.values(this.completionProgress);
  const completed = sections.filter(Boolean).length;
  return Math.round((completed / sections.length) * 100);
});

// Method to check if restaurant setup is complete
restaurantSchema.methods.checkCompletionStatus = function() {
  const hasOperatingHours = Object.values(this.operatingHours).some(day =>
    day && !day.isClosed && day.open && day.close
  );

  const required = {
    basicInfo: this.description && this.description.length > 0,
    location: this.location.address && this.location.city && this.location.district,
    contact: this.contact.phone,
    menu: this.menu && this.menu.length > 0 &&
           this.menu.some(category => category.items && category.items.length > 0),
    hours: hasOperatingHours,
    capacity: this.capacity && this.capacity > 0
  };

  // Update completion progress
  this.completionProgress = required;
  
  // Check if all required sections are complete
  const isComplete = required.basicInfo && required.location &&
                    required.contact && required.menu &&
                    required.hours && required.capacity;
  
  this.isSetupComplete = isComplete;
  
  return isComplete;
};

// Method to activate restaurant after completion
restaurantSchema.methods.activateRestaurant = function() {
  if (this.checkCompletionStatus()) {
    this.status = 'active';
    return this.save();
  }
  throw new Error('Restaurant setup is not complete');
};

// Index for better search performance
restaurantSchema.index({ name: 'text', description: 'text' });
restaurantSchema.index({ 'location.city': 1 });
restaurantSchema.index({ 'location.district': 1 });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ priceRange: 1 });
restaurantSchema.index({ 'rating.average': -1 });
restaurantSchema.index({ owner: 1 });
restaurantSchema.index({ status: 1 });
restaurantSchema.index({ isActive: 1, isVerified: 1 });
restaurantSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
