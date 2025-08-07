const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const Transport = require('../models/Transport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHotels = await Hotel.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalTransport = await Transport.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const pendingApprovals = await Hotel.countDocuments({ status: 'pending' }) + 
                            await Restaurant.countDocuments({ status: 'pending' }) + 
                            await Transport.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      totalHotels,
      totalRestaurants,
      totalTransport,
      totalBookings: 0, // Implement when booking system is ready
      revenue: 0, // Implement when payment system is ready
      activeUsers,
      pendingApprovals
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create owner account with hotel (simplified)
exports.createOwnerWithHotel = async (req, res) => {
  try {
    const {
      ownerFirstName,
      ownerLastName,
      ownerEmail,
      ownerPhone,
      ownerPassword,
      businessName
    } = req.body;

    // Check if owner email already exists
    const existingUser = await User.findOne({ email: ownerEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Owner email already exists' });
    }

    // Create owner account
    const owner = new User({
      firstName: ownerFirstName,
      lastName: ownerLastName,
      email: ownerEmail,
      phone: ownerPhone,
      password: ownerPassword,
      role: 'owner',
      businessType: 'hotel',
      isActive: true
    });

    await owner.save();

    // Create minimal hotel with pending status
    const hotel = new Hotel({
      name: businessName,
      owner: owner._id,
      status: 'pending',
      isSetupComplete: false,
      rating: {
        average: 0,
        count: 0
      }
    });

    await hotel.save();

    res.status(201).json({
      message: 'Owner and hotel created successfully. Owner can now log in to complete setup.',
      owner: {
        id: owner._id,
        name: `${owner.firstName} ${owner.lastName}`.trim(),
        email: owner.email
      },
      hotel: {
        id: hotel._id,
        name: hotel.name,
        status: hotel.status,
        completionPercentage: 0
      }
    });

  } catch (error) {
    console.error('Create owner with hotel error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create owner account with restaurant (simplified)
exports.createOwnerWithRestaurant = async (req, res) => {
  try {
    const {
      ownerFirstName,
      ownerLastName,
      ownerEmail,
      ownerPhone,
      ownerPassword,
      businessName
    } = req.body;

    // Check if owner email already exists
    const existingUser = await User.findOne({ email: ownerEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Owner email already exists' });
    }

    // Create owner account
    const owner = new User({
      firstName: ownerFirstName,
      lastName: ownerLastName,
      email: ownerEmail,
      phone: ownerPhone,
      password: ownerPassword,
      role: 'owner',
      businessType: 'restaurant',
      isActive: true
    });

    await owner.save();

    // Create minimal restaurant with pending status
    const restaurant = new Restaurant({
      name: businessName,
      owner: owner._id,
      status: 'pending',
      isSetupComplete: false,
      priceRange: 'Budget', // Default value
      rating: {
        average: 0,
        count: 0
      }
    });

    await restaurant.save();

    res.status(201).json({
      message: 'Owner and restaurant created successfully. Owner can now log in to complete setup.',
      owner: {
        id: owner._id,
        name: `${owner.firstName} ${owner.lastName}`.trim(),
        email: owner.email
      },
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        status: restaurant.status,
        completionPercentage: 0
      }
    });

  } catch (error) {
    console.error('Create owner with restaurant error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create owner account with transport service (simplified)
exports.createOwnerWithTransport = async (req, res) => {
  try {
    const {
      ownerFirstName,
      ownerLastName,
      ownerEmail,
      ownerPhone,
      ownerPassword,
      businessName,
      transportType
    } = req.body;

    // Check if owner email already exists
    const existingUser = await User.findOne({ email: ownerEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Owner email already exists' });
    }

    // Create owner account
    const owner = new User({
      firstName: ownerFirstName,
      lastName: ownerLastName,
      email: ownerEmail,
      phone: ownerPhone,
      password: ownerPassword,
      role: 'owner',
      businessType: 'transport',
      isActive: true
    });

    await owner.save();

    // Create minimal transport service with pending status
    const transport = new Transport({
      name: businessName,
      owner: owner._id,
      type: transportType || 'Car Rental',
      status: 'pending',
      isSetupComplete: false,
      rating: {
        average: 0,
        count: 0
      }
    });

    await transport.save();

    res.status(201).json({
      message: 'Owner and transport service created successfully. Owner can now log in to complete setup.',
      owner: {
        id: owner._id,
        name: `${owner.firstName} ${owner.lastName}`.trim(),
        email: owner.email
      },
      transport: {
        id: transport._id,
        name: transport.name,
        type: transport.type,
        status: transport.status,
        completionPercentage: 0
      }
    });

  } catch (error) {
    console.error('Create owner with transport error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all owners
exports.getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' })
      .select('-password')
      .populate({
        path: 'hotels',
        select: 'name status'
      })
      .populate({
        path: 'restaurants', 
        select: 'name status'
      })
      .populate({
        path: 'transports',
        select: 'name type status'
      });

    res.json(owners);
  } catch (error) {
    console.error('Get owners error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all listings with owner info
exports.getAllListings = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('owner', 'name email phone');
    const restaurants = await Restaurant.find().populate('owner', 'name email phone');
    const transports = await Transport.find().populate('owner', 'name email phone');

    res.json({
      hotels,
      restaurants,
      transports
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update listing status
exports.updateListingStatus = async (req, res) => {
  try {
    const { type, id, status } = req.body;
    let listing;

    switch (type) {
      case 'hotel':
        listing = await Hotel.findByIdAndUpdate(id, { status }, { new: true });
        break;
      case 'restaurant':
        listing = await Restaurant.findByIdAndUpdate(id, { status }, { new: true });
        break;
      case 'transport':
        listing = await Transport.findByIdAndUpdate(id, { status }, { new: true });
        break;
      default:
        return res.status(400).json({ message: 'Invalid listing type' });
    }

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json({ message: 'Listing status updated successfully', listing });
  } catch (error) {
    console.error('Update listing status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete listing
exports.deleteListing = async (req, res) => {
  try {
    const { type, id } = req.params;
    let listing;

    switch (type) {
      case 'hotel':
        listing = await Hotel.findByIdAndDelete(id);
        break;
      case 'restaurant':
        listing = await Restaurant.findByIdAndDelete(id);
        break;
      case 'transport':
        listing = await Transport.findByIdAndDelete(id);
        break;
      default:
        return res.status(400).json({ message: 'Invalid listing type' });
    }

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create owner account only (simplified for new system)
exports.createOwner = async (req, res) => {
  try {
    const { businessType, email, password, businessName } = req.body;

    // Validate required fields
    if (!businessType || !email || !password || !businessName) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required: businessType, email, password, businessName' 
      });
    }

    // Check if owner email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Owner email already exists' 
      });
    }

    // Create owner account
    const owner = new User({
      firstName: businessName, // Use business name as first name initially
      lastName: 'Owner', // Default last name
      email,
      password,
      role: 'owner',
      businessType,
      isActive: true,
      isEmailVerified: true // Auto-verify for admin-created accounts
    });

    await owner.save();

    res.status(201).json({
      success: true,
      message: `${businessType.charAt(0).toUpperCase() + businessType.slice(1)} owner created successfully! Email: ${email}`,
      owner: {
        id: owner._id,
        email: owner.email,
        businessType: owner.businessType,
        businessName
      }
    });

  } catch (error) {
    console.error('Create owner error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};
