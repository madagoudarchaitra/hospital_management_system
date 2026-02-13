const { User, Patient, Doctor } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

exports.registerValidators = [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password, role } = req.body;
  try{
    const exist = await User.findOne({ where: { email } });
    if(exist) return res.status(400).json({ message: 'Email in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    if(role === 'patient') await Patient.create({ userId: user.id });
    if(role === 'doctor') await Doctor.create({ userId: user.id });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginValidators = [ body('email').isEmail(), body('password').notEmpty() ];

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  try{
    const user = await User.findOne({ where: { email } });
    if(!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try{
    const user = await User.findByPk(req.user.id, { attributes: ['id','name','email','role'] });
    res.json(user);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
};
