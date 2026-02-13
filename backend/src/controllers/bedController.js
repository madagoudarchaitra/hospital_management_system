const { Bed } = require('../models');

exports.create = async (req, res) => {
  try{ const b = await Bed.create(req.body); res.json(b); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.list = async (req, res) => {
  try{ const list = await Bed.findAll(); res.json(list); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.get = async (req, res) => {
  try{ const b = await Bed.findByPk(req.params.id); if(!b) return res.status(404).json({}); res.json(b); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try{ const b = await Bed.findByPk(req.params.id); if(!b) return res.status(404).json({}); await b.update(req.body); res.json(b); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try{ const b = await Bed.findByPk(req.params.id); if(!b) return res.status(404).json({}); await b.destroy(); res.json({}); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};
