const { User } = require('../models');
const bcrypt = require('bcrypt');
const { Patient, Doctor } = require('../models');

exports.list = async (req, res) => {
  try{ const users = await User.findAll({ attributes: ['id','name','email','role'] }); res.json(users); }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try{
    const u = await User.findByPk(req.params.id);
    if(!u) return res.status(404).json({ message: 'User not found' });
    const { role, name } = req.body;
    if(role) u.role = role;
    if(name) u.name = name;
    await u.save();
    res.json({ id: u.id, name: u.name, email: u.email, role: u.role });
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.create = async (req, res) => {
  try{
    const { name, email, password, role } = req.body;
    if(!name || !email) return res.status(400).json({ message: 'Name and email required' });
    const exist = await User.findOne({ where: { email } });
    if(exist) return res.status(400).json({ message: 'Email in use' });
    const pwd = password && password.length >= 6 ? password : (Math.random().toString(36).slice(-8) + '1A');
    const hashed = await bcrypt.hash(pwd, 10);
    const user = await User.create({ name, email, password: hashed, role });
    if(user.role === 'patient') await Patient.create({ userId: user.id });
    if(user.role === 'doctor') await Doctor.create({ userId: user.id });
    // do not return password
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try{ const u = await User.findByPk(req.params.id); if(!u) return res.status(404).json({ message: 'User not found' }); await u.destroy(); res.json({}); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};
