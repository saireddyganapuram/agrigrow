const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Book a new appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, time, reason } = req.body;
    const userId = req.user.id;

    // Validate doctor exists and is active
    const doctor = await Doctor.findOne({ _id: doctorId, isActive: true });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found or inactive' });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    // Create new appointment
    const appointment = new Appointment({
      doctor: doctorId,
      user: userId,
      date: new Date(date),
      time,
      reason,
      status: 'pending'
    });

    // Save the appointment
    const savedAppointment = await appointment.save();

    // Populate doctor and user details for the response
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('doctor', 'fullname specialization')
      .populate('user', 'fullname email phone');

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: {
        id: populatedAppointment._id,
        doctor: {
          id: populatedAppointment.doctor._id,
          fullname: populatedAppointment.doctor.fullname,
          specialization: populatedAppointment.doctor.specialization
        },
        user: {
          id: populatedAppointment.user._id,
          fullname: populatedAppointment.user.fullname || populatedAppointment.user.name,
          email: populatedAppointment.user.email,
          phone: populatedAppointment.user.phone
        },
        date: populatedAppointment.date,
        time: populatedAppointment.time,
        formattedDate: populatedAppointment.formattedDate,
        formattedTime: populatedAppointment.formattedTime,
        reason: populatedAppointment.reason,
        status: populatedAppointment.status,
        notes: populatedAppointment.notes
      }
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({ error: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ error: 'Server error while booking appointment' });
  }
};

// Get appointments for a doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    // Verify the user is a doctor
    if (req.user.type !== 'doctor') {
      return res.status(403).json({ error: 'Access denied. Doctor account required.' });
    }

    const { status } = req.query;
    const doctorId = req.user.id;

    const query = { doctor: doctorId };
    if (status) {
      query.status = status.toLowerCase();
    }

    const appointments = await Appointment.find(query)
      .populate('user', 'fullname email phone')
      .sort({ date: 1, time: 1 });

    res.json({
      appointments: appointments.map(apt => ({
        id: apt._id,
        user: {
          id: apt.user._id,
          fullname: apt.user.fullname || apt.user.name,
          email: apt.user.email,
          phone: apt.user.phone
        },
        date: apt.date,
        time: apt.time,
        formattedDate: apt.formattedDate,
        formattedTime: apt.formattedTime,
        reason: apt.reason,
        status: apt.status,
        notes: apt.notes,
        createdAt: apt.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({ error: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ error: 'Server error while fetching appointments' });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;
    const doctorId = req.user.id;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctor: doctorId },
      { status, notes, updatedAt: Date.now() },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({
      message: 'Appointment updated successfully',
      appointment: {
        id: appointment._id,
        status: appointment.status,
        notes: appointment.notes,
        updatedAt: appointment.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({ error: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ error: 'Server error while updating appointment' });
  }
};

// Get user's appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const query = { user: userId };
    if (status) {
      query.status = status.toLowerCase();
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'fullname specialization')
      .sort({ date: 1, time: 1 });

    res.json({
      appointments: appointments.map(apt => ({
        id: apt._id,
        doctor: {
          id: apt.doctor._id,
          fullname: apt.doctor.fullname,
          specialization: apt.doctor.specialization
        },
        date: apt.date,
        time: apt.time,
        formattedDate: apt.formattedDate,
        formattedTime: apt.formattedTime,
        reason: apt.reason,
        status: apt.status,
        notes: apt.notes,
        createdAt: apt.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching user appointments:', error);
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({ error: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ error: 'Server error while fetching appointments' });
  }
};
