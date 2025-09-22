const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

function generateToken(customer) {
  const payload = { id: customer._id, email: customer.email, name: customer.fullname, type: 'customer' };
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullname,
    email,
    username,
    phone,
    address,
    password,
    dateOfBirth,
    gender,
    emergencyContact
  } = req.body;

  try {
    const existing = await Customer.findOne({ $or: [{ email }, { username }] });
    if (existing && existing.email === email) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    if (existing && existing.username === username) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await Customer.hashPassword(password);
    const customer = await Customer.create({
      fullname,
      email,
      username,
      phone,
      address,
      passwordHash,
      dateOfBirth,
      gender,
      emergencyContact
    });

    const token = generateToken(customer);
    return res.status(201).json({
      customer: {
        id: customer._id,
        fullname: customer.fullname,
        email: customer.email,
        username: customer.username,
        phone: customer.phone,
        address: customer.address,
        dateOfBirth: customer.dateOfBirth,
        gender: customer.gender,
        emergencyContact: customer.emergencyContact
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to register customer' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username, password } = req.body;

  try {
    const query = email ? { email } : { username };
    const customer = await Customer.findOne(query);
    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await customer.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(customer);
    return res.json({
      customer: {
        id: customer._id,
        fullname: customer.fullname,
        email: customer.email,
        username: customer.username,
        phone: customer.phone,
        address: customer.address,
        dateOfBirth: customer.dateOfBirth,
        gender: customer.gender,
        emergencyContact: customer.emergencyContact
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-passwordHash');
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    return res.json({ customer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const customerId = req.user.id;
    const {
      fullname,
      email,
      phone,
      address,
      username,
      dateOfBirth,
      gender,
      emergencyContact
    } = req.body;

    // Check if email is already taken by another customer
    if (email) {
      const existingCustomer = await Customer.findOne({ email, _id: { $ne: customerId } });
      if (existingCustomer) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Check if username is already taken by another customer
    if (username) {
      const existingCustomer = await Customer.findOne({ username, _id: { $ne: customerId } });
      if (existingCustomer) {
        return res.status(400).json({ error: 'Username already in use' });
      }
    }

    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (username) updateData.username = username;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      updateData,
      { new: true, select: '-passwordHash' }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    return res.json({ customer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ isActive: true }).select('-passwordHash').sort({ createdAt: -1 });
    return res.json({ customers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-passwordHash');
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    return res.json({ customer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    return res.json({ message: 'Customer deactivated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.addMedicalHistory = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { condition, diagnosedDate, status } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $push: {
          medicalHistory: {
            condition,
            diagnosedDate,
            status: status || 'Active'
          }
        }
      },
      { new: true, select: '-passwordHash' }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    return res.json({ customer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateMedicalHistory = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { historyId, condition, diagnosedDate, status } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { _id: customerId, 'medicalHistory._id': historyId },
      {
        $set: {
          'medicalHistory.$.condition': condition,
          'medicalHistory.$.diagnosedDate': diagnosedDate,
          'medicalHistory.$.status': status
        }
      },
      { new: true, select: '-passwordHash' }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Medical history entry not found' });
    }

    return res.json({ customer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteMedicalHistory = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { historyId } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $pull: { medicalHistory: { _id: historyId } } },
      { new: true, select: '-passwordHash' }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer or medical history entry not found' });
    }

    return res.json({ customer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
