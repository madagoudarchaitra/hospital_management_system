const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

async function authenticate(req, res, next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = header.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if(!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  }catch(err){
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function authorize(roles = []){
  if(typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if(!roles.length) return next();
    if(!req.user) return res.status(403).json({ message: 'Forbidden' });
    if(!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  }
}

module.exports = { authenticate, authorize };
