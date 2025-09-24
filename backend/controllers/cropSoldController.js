const CropSold = require('../models/CropSold');
const CropListing = require('../models/CropListing');
const CustomerPurchase = require('../models/CustomerPurchase');
const Customer = require('../models/Customer');
const User = require('../models/User');

exports.recordCropSale = async (req, res) => {
  try {
    const { cropListingId, quantity, transactionId, paymentMethod } = req.body;
    const customerId = req.user.id;

    // Get customer details
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get crop listing details
    const cropListing = await CropListing.findById(cropListingId);
    if (!cropListing) {
      return res.status(404).json({ error: 'Crop listing not found' });
    }

    // Get farmer details
    const farmer = await User.findById(cropListing.farmer);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    const totalAmount = cropListing.price * quantity;

    // Create crop sold record (for farmer)
    const cropSold = new CropSold({
      customer: customerId,
      farmer: cropListing.farmer,
      cropListing: cropListingId,
      cropName: cropListing.cropName,
      farmerName: farmer.fullname || farmer.name,
      customerName: customer.fullname,
      quantity,
      unit: cropListing.unit,
      pricePerUnit: cropListing.price,
      totalAmount
    });

    // Create customer purchase record (for customer)
    const customerPurchase = new CustomerPurchase({
      customer: customerId,
      cropName: cropListing.cropName,
      farmerName: farmer.fullname || farmer.name,
      quantity,
      unit: cropListing.unit,
      pricePerUnit: cropListing.price,
      totalAmount,
      transactionId,
      paymentMethod
    });

    // Save both records
    await cropSold.save();
    await customerPurchase.save();

    // Remove crop listing after purchase
    await CropListing.findByIdAndDelete(cropListingId);

    res.status(201).json({
      message: 'Purchase completed successfully',
      sale: cropSold,
      purchase: customerPurchase
    });
  } catch (error) {
    console.error('Error recording crop sale:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFarmerSales = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const sales = await CropSold.find({ farmer: farmerId })
      .populate('customer', 'fullname')
      .sort({ purchaseDate: -1 });

    res.json({ sales });
  } catch (error) {
    console.error('Error fetching farmer sales:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCustomerPurchaseHistory = async (req, res) => {
  try {
    const customerId = req.user.id;

    const purchases = await CropSold.find({ customer: customerId })
      .populate('farmer', 'fullname name')
      .populate('cropListing', 'description')
      .sort({ purchaseDate: -1 });

    res.json({ purchases });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({ error: 'Server error' });
  }
};