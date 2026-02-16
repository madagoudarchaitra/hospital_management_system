const { Staff, User } = require('../models');

exports.create = async (req, res) => {
  try{ const s = await Staff.create(req.body); res.json(s); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.list = async (req, res) => {
  try{ 
    const list = await Staff.findAll({ include: [{ model: User, attributes: ['name', 'email'] }] }); 
    res.json(list); 
  }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.get = async (req, res) => {
  try{ 
    const s = await Staff.findByPk(req.params.id, { include: [{ model: User, attributes: ['name', 'email'] }] }); 
    if(!s) return res.status(404).json({}); 
    res.json(s); 
  }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try{ const s = await Staff.findByPk(req.params.id); if(!s) return res.status(404).json({}); await s.update(req.body); res.json(s); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try{ const s = await Staff.findByPk(req.params.id); if(!s) return res.status(404).json({}); await s.destroy(); res.json({}); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};
