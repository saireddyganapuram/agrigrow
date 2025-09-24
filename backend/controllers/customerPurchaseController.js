const CustomerPurchase = require('../models/CustomerPurchase');

exports.recordPurchase = async (req, res) => {
  try {
    const { cropName, farmerName, quantity, unit, pricePerUnit, totalAmount, transactionId, paymentMethod } = req.body;
    const customerId = req.user.id;

    const purchase = new CustomerPurchase({
      customer: customerId,
      cropName,
      farmerName,
      quantity,
      unit,
      pricePerUnit,
      totalAmount,
      transactionId,
      paymentMethod
    });

    await purchase.save();

    res.status(201).json({
      message: 'Purchase recorded successfully',
      purchase
    });
  } catch (error) {
    console.error('Error recording purchase:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPurchaseHistory = async (req, res) => {
  try {
    const customerId = req.user.id;

    const purchases = await CustomerPurchase.find({ customer: customerId })
      .sort({ purchaseDate: -1 });

    res.json({ purchases });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({ error: 'Server error' });
  }
};