const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const Transport = require('../models/Transport');

// Get owner's business details
exports.getOwnerBusiness = async (req, res) => {
  try {
    const owner = await User.findById(req.user.id);
    if (!owner || owner.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Owner role required.' });
    }

    let business = null;
    
    switch (owner.businessType) {
      case 'hotel':
        business = await Hotel.findOne({ owner: owner._id });
        break;
      case 'restaurant':
        business = await Restaurant.findOne({ owner: owner._id });
        break;
      case 'transport':
        business = await Transport.findOne({ owner: owner._id });
        break;
      default:
        return res.status(400).json({ message: 'Invalid business type' });
    }

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.json({
      success: true,
      owner: {
        id: owner._id,
        name: owner.fullName,
        email: owner.email,
        phone: owner.phone,
        businessType: owner.businessType,
        hasCompletedSetup: owner.hasCompletedSetup
      },
      business
    });

  } catch (error) {
    console.error('Get owner business error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update owner's business details
exports.updateOwnerBusiness = async (req, res) => {
  try {
    const owner = await User.findById(req.user.id);
    if (!owner || owner.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Owner role required.' });
    }

    let business = null;
    let Model = null;

    switch (owner.businessType) {
      case 'hotel':
        Model = Hotel;
        break;
      case 'restaurant':
        Model = Restaurant;
        break;
      case 'transport':
        Model = Transport;
        break;
      default:
        return res.status(400).json({ message: 'Invalid business type' });
    }

    business = await Model.findOne({ owner: owner._id });
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Remove admin-created fields from update data
    const updateData = { ...req.body };
    delete updateData.name; // Business name is admin-set
    delete updateData.owner; // Owner cannot be changed
    delete updateData.adminCreatedFields; // Protect admin fields

    // Update business with new data
    Object.assign(business, updateData);

    // Check completion status
    const isComplete = business.checkCompletionStatus();
    
    await business.save();

    // If business is now complete, mark owner setup as complete
    if (isComplete && !owner.hasCompletedSetup) {
      await owner.markSetupComplete();
    }

    res.json({
      success: true,
      message: 'Business updated successfully',
      business,
      isSetupComplete: business.isSetupComplete,
      completionPercentage: business.completionPercentage
    });

  } catch (error) {
    console.error('Update owner business error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Complete business setup and activate
exports.completeBusiness = async (req, res) => {
  try {
    const owner = await User.findById(req.user.id);
    if (!owner || owner.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Owner role required.' });
    }

    let business = null;
    let Model = null;

    switch (owner.businessType) {
      case 'hotel':
        Model = Hotel;
        break;
      case 'restaurant':
        Model = Restaurant;
        break;
      case 'transport':
        Model = Transport;
        break;
      default:
        return res.status(400).json({ message: 'Invalid business type' });
    }

    business = await Model.findOne({ owner: owner._id });
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Check if business setup is complete
    const isComplete = business.checkCompletionStatus();
    
    if (!isComplete) {
      return res.status(400).json({
        message: 'Business setup is not complete',
        completionProgress: business.completionProgress,
        completionPercentage: business.completionPercentage
      });
    }

    // Activate business
    try {
      if (owner.businessType === 'hotel') {
        await business.activateHotel();
      } else if (owner.businessType === 'restaurant') {
        await business.activateRestaurant();
      } else if (owner.businessType === 'transport') {
        await business.activateTransport();
      }

      // Mark owner setup as complete
      if (!owner.hasCompletedSetup) {
        await owner.markSetupComplete();
      }

      res.json({
        success: true,
        message: 'Business activated successfully! Your listing is now live.',
        business: {
          id: business._id,
          name: business.name,
          status: business.status,
          isSetupComplete: business.isSetupComplete
        }
      });

    } catch (activationError) {
      return res.status(400).json({
        message: activationError.message,
        completionProgress: business.completionProgress
      });
    }

  } catch (error) {
    console.error('Complete business error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get business completion progress
exports.getBusinessProgress = async (req, res) => {
  try {
    const owner = await User.findById(req.user.id);
    if (!owner || owner.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Owner role required.' });
    }

    let business = null;
    let Model = null;

    switch (owner.businessType) {
      case 'hotel':
        Model = Hotel;
        break;
      case 'restaurant':
        Model = Restaurant;
        break;
      case 'transport':
        Model = Transport;
        break;
      default:
        return res.status(400).json({ message: 'Invalid business type' });
    }

    business = await Model.findOne({ owner: owner._id });
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Update completion status
    business.checkCompletionStatus();

    res.json({
      success: true,
      businessType: owner.businessType,
      businessName: business.name,
      status: business.status,
      isSetupComplete: business.isSetupComplete,
      completionProgress: business.completionProgress,
      completionPercentage: business.completionPercentage,
      ownerHasCompletedSetup: owner.hasCompletedSetup
    });

  } catch (error) {
    console.error('Get business progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get business requirements based on type
exports.getBusinessRequirements = async (req, res) => {
  try {
    const owner = await User.findById(req.user.id);
    if (!owner || owner.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Owner role required.' });
    }

    const requirements = {
      hotel: {
        basicInfo: ['description'],
        location: ['address', 'city', 'district'],
        contact: ['phone'],
        rooms: ['At least one room type with pricing'],
        amenities: ['Optional - can be added later'],
        policies: ['checkInTime', 'checkOutTime']
      },
      restaurant: {
        basicInfo: ['description'],
        location: ['address', 'city', 'district'],
        contact: ['phone'],
        menu: ['At least one menu category with items'],
        hours: ['Operating hours for at least one day'],
        capacity: ['Seating capacity']
      },
      transport: {
        basicInfo: ['description'],
        contact: ['phone'],
        serviceArea: ['At least one service area'],
        vehicles: ['At least one vehicle with pricing'],
        policies: ['Basic terms and conditions']
      }
    };

    res.json({
      success: true,
      businessType: owner.businessType,
      requirements: requirements[owner.businessType] || {}
    });

  } catch (error) {
    console.error('Get business requirements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};