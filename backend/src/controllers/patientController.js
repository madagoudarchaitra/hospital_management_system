const { Patient, User } = require('../models');

exports.create = async (req, res) => {
  try{
    const p = await Patient.create(req.body);
    res.json(p);
  }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.list = async (req, res) => {
  try{ const list = await Patient.findAll({ include: User }); res.json(list); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.get = async (req, res) => {
  try{ const p = await Patient.findByPk(req.params.id, { include: User }); if(!p) return res.status(404).json({}); res.json(p); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try{ const p = await Patient.findByPk(req.params.id); if(!p) return res.status(404).json({}); await p.update(req.body); res.json(p); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try{ const p = await Patient.findByPk(req.params.id); if(!p) return res.status(404).json({}); await p.destroy(); res.json({}); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};
