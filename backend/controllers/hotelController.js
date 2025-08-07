const Hotel = require('../models/Hotel');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };
    
    // Filter by verification status for admin
    if (req.user && req.user.role === 'admin' && req.query.verified !== undefined) {
      query.isVerified = req.query.verified === 'true';
    } else if (!req.user || req.user.role === 'user') {
      query.isVerified = true; // Regular users only see verified hotels
    }

    // Filter by city
    if (req.query.city) {
      query['location.city'] = new RegExp(req.query.city, 'i');
    }

    // Filter by district
    if (req.query.district) {
      query['location.district'] = new RegExp(req.query.district, 'i');
    }

    // Filter by star rating
    if (req.query.starRating) {
      query.starRating = parseInt(req.query.starRating);
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = parseInt(req.query.maxPrice);
      query['rooms.pricePerNight'] = priceFilter;
    }

    // Filter by amenities
    if (req.query.amenities) {
      const amenities = req.query.amenities.split(',');
      query.amenities = { $in: amenities };
    }

    // Search by name or description
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Sort options
    let sortOptions = {};
    switch (req.query.sort) {
      case 'rating':
        sortOptions = { 'rating.average': -1 };
        break;
      case 'price_low':
        sortOptions = { 'rooms.pricePerNight': 1 };
        break;
      case 'price_high':
        sortOptions = { 'rooms.pricePerNight': -1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const hotels = await Hotel.find(query)
      .populate('owner', 'firstName lastName email phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Hotel.countDocuments(query);

    res.status(200).json({
      success: true,
      count: hotels.length,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hotels
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hotels'
    });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone');
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check if user can access this hotel
    if (!hotel.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    if (!hotel.isVerified && (!req.user || (req.user.role === 'user'))) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      hotel
    });
  } catch (error) {
    console.error('Get hotel error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching hotel'
    });
  }
};

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private/Owner
const createHotel = async (req, res) => {
  try {
    // Add owner to hotel data
    req.body.owner = req.user.id;

    const hotel = await Hotel.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      hotel
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating hotel'
    });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Owner
const updateHotel = async (req, res) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check ownership (only owner and admin can update)
    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this hotel'
      });
    }

    hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('owner', 'firstName lastName email phone');

    res.status(200).json({
      success: true,
      message: 'Hotel updated successfully',
      hotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating hotel'
    });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Owner/Admin
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check ownership (only owner and admin can delete)
    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this hotel'
      });
    }

    await Hotel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting hotel'
    });
  }
};

// @desc    Verify hotel
// @route   PUT /api/hotels/:id/verify
// @access  Private/Admin
const verifyHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: req.user.id
      },
      { new: true }
    ).populate('owner', 'firstName lastName email phone');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hotel verified successfully',
      hotel
    });
  } catch (error) {
    console.error('Verify hotel error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while verifying hotel'
    });
  }
};

// @desc    Get owner's hotels
// @route   GET /api/hotels/my-hotels
// @access  Private/Owner
const getMyHotels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const hotels = await Hotel.find({ owner: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Hotel.countDocuments({ owner: req.user.id });

    res.status(200).json({
      success: true,
      count: hotels.length,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hotels
    });
  } catch (error) {
    console.error('Get my hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your hotels'
    });
  }
};

module.exports = {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  verifyHotel,
  getMyHotels
};
