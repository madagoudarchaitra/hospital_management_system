const { Doctor, User } = require('../models');

exports.create = async (req, res) => {
  try{ const d = await Doctor.create(req.body); res.json(d); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.list = async (req, res) => {
  try{ const list = await Doctor.findAll({ include: User }); res.json(list); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.get = async (req, res) => {
  try{ const d = await Doctor.findByPk(req.params.id, { include: User }); if(!d) return res.status(404).json({}); res.json(d); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try{ const d = await Doctor.findByPk(req.params.id); if(!d) return res.status(404).json({}); await d.update(req.body); res.json(d); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try{ const d = await Doctor.findByPk(req.params.id); if(!d) return res.status(404).json({}); await d.destroy(); res.json({}); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};
