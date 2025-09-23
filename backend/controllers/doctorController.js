const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

function generateToken(doctor) {
  const payload = { id: doctor._id, email: doctor.email, name: doctor.fullname, type: 'doctor' };
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, username, phone, address, password, qualification, specialization, experience, licenseNumber, confirmPassword } = req.body;

  try {
    const existing = await Doctor.findOne({ $or: [{ email }, { username }] });
    if (existing && existing.email === email) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    if (existing && existing.username === username) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await Doctor.hashPassword(password);
    const doctor = await Doctor.create({
      fullname,
      email,
      username,
      phone,
      address,
      passwordHash,
      qualification,
      specialization,
      experience,
      licenseNumber
    });

    const token = generateToken(doctor);
    return res.status(201).json({
      doctor: {
        id: doctor._id,
        fullname: doctor.fullname,
        email: doctor.email,
        username: doctor.username,
        phone: doctor.phone,
        address: doctor.address,
        qualification: doctor.qualification,
        specialization: doctor.specialization,
        experience: doctor.experience,
        licenseNumber: doctor.licenseNumber
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to register doctor' });
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
    const doctor = await Doctor.findOne(query);
    if (!doctor) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await doctor.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(doctor);
    return res.json({
      doctor: {
        id: doctor._id,
        fullname: doctor.fullname,
        email: doctor.email,
        username: doctor.username,
        phone: doctor.phone,
        address: doctor.address,
        qualification: doctor.qualification,
        specialization: doctor.specialization,
        experience: doctor.experience,
        licenseNumber: doctor.licenseNumber
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
    if (req.user.type !== 'doctor') {
      return res.status(403).json({ error: 'Access denied. Doctor account required.' });
    }
    
    const doctor = await Doctor.findById(req.user.id).select('-passwordHash');
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    return res.json({ doctor });
  } catch (err) {
    console.error('Error in getMe:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { fullname, email, phone, address, username, qualification, specialization, experience, licenseNumber } = req.body;

    // Check if email is already taken by another doctor
    if (email) {
      const existingDoctor = await Doctor.findOne({ email, _id: { $ne: doctorId } });
      if (existingDoctor) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Check if username is already taken by another doctor
    if (username) {
      const existingDoctor = await Doctor.findOne({ username, _id: { $ne: doctorId } });
      if (existingDoctor) {
        return res.status(400).json({ error: 'Username already in use' });
      }
    }

    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (username) updateData.username = username;
    if (qualification) updateData.qualification = qualification;
    if (specialization) updateData.specialization = specialization;
    if (experience !== undefined) updateData.experience = experience;
    if (licenseNumber) updateData.licenseNumber = licenseNumber;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      updateData,
      { new: true, select: '-passwordHash' }
    );

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    return res.json({ doctor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).select('-passwordHash').sort({ createdAt: -1 });
    return res.json({ doctors });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-passwordHash');
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    return res.json({ doctor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    return res.json({ message: 'Doctor deactivated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
