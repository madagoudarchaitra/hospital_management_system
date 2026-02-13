const { User } = require('../models');

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

exports.remove = async (req, res) => {
  try{ const u = await User.findByPk(req.params.id); if(!u) return res.status(404).json({ message: 'User not found' }); await u.destroy(); res.json({}); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};
