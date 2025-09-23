const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const decoded = jwt.verify(token, secret);
    
    // Check if the user exists in either the Doctor or User collection
    const doctor = await Doctor.findById(decoded.id);
    const user = await User.findById(decoded.id);
    
    if (!doctor && !user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = {
      id: decoded.id,
      type: decoded.type || 'user',
      ...decoded
    };
    
    return next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};


