const Transport = require('../models/Transport');

// Get all transport services
exports.getAllTransports = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      type, 
      city, 
      district, 
      rating,
      search 
    } = req.query;

    // Build filter object
    let filter = { status: 'active' };

    if (type) filter.type = type;
    if (city) filter['serviceArea.city'] = new RegExp(city, 'i');
    if (district) filter['serviceArea.district'] = new RegExp(district, 'i');
    if (rating) filter['rating.average'] = { $gte: parseFloat(rating) };
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { type: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transport.countDocuments(filter);
    const transports = await Transport.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: transports,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total: total,
        limit: parseInt(limit),
        hasNext: skip + transports.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get transports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get single transport service
exports.getTransport = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('reviews.user', 'name');

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Transport service not found'
      });
    }

    res.json({
      success: true,
      data: transport
    });
  } catch (error) {
    console.error('Get transport error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create transport service (for owners)
exports.createTransport = async (req, res) => {
  try {
    const transportData = {
      ...req.body,
      owner: req.user.id,
      status: 'pending' // Transport services need approval
    };

    const transport = new Transport(transportData);
    await transport.save();

    res.status(201).json({
      success: true,
      message: 'Transport service created successfully',
      data: transport
    });
  } catch (error) {
    console.error('Create transport error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update transport service (for owners)
exports.updateTransport = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Transport service not found'
      });
    }

    // Check if user is the owner or admin
    if (transport.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedTransport = await Transport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Transport service updated successfully',
      data: updatedTransport
    });
  } catch (error) {
    console.error('Update transport error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete transport service (for owners and admin)
exports.deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Transport service not found'
      });
    }

    // Check if user is the owner or admin
    if (transport.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Transport.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Transport service deleted successfully'
    });
  } catch (error) {
    console.error('Delete transport error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add review to transport service
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const transport = await Transport.findById(req.params.id);

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Transport service not found'
      });
    }

    // Check if user already reviewed
    const existingReview = transport.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this transport service'
      });
    }

    const review = {
      user: req.user.id,
      rating: parseInt(rating),
      comment,
      date: new Date()
    };

    transport.reviews.push(review);

    // Calculate new average rating
    const totalRating = transport.reviews.reduce((sum, review) => sum + review.rating, 0);
    transport.rating = {
      average: totalRating / transport.reviews.length,
      count: transport.reviews.length
    };

    await transport.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: transport
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get transport services by owner
exports.getOwnerTransports = async (req, res) => {
  try {
    const transports = await Transport.find({ owner: req.user.id });

    res.json({
      success: true,
      data: transports
    });
  } catch (error) {
    console.error('Get owner transports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
