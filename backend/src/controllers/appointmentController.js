const { Appointment } = require('../models');

exports.create = async (req, res) => {
  try{ const a = await Appointment.create(req.body); res.json(a); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.list = async (req, res) => {
  try{ 
    const list = await Appointment.findAll(); 
    res.json(list); 
  }catch(err){ 
    console.error('Error listing appointments:', err);
    res.status(500).json({ message: 'Server error', error: err.message }); 
  }
};

exports.get = async (req, res) => {
  try{ const a = await Appointment.findByPk(req.params.id); if(!a) return res.status(404).json({}); res.json(a); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try{ const a = await Appointment.findByPk(req.params.id); if(!a) return res.status(404).json({}); await a.update(req.body); res.json(a); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try{ const a = await Appointment.findByPk(req.params.id); if(!a) return res.status(404).json({}); await a.destroy(); res.json({}); }catch(err){ res.status(500).json({ message: 'Server error' }); }
};
